mod errors;
mod hash;
mod internal;
mod model;
mod utils;

use axum::{
    extract::{Query, State},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use model::query::{self, DirectoryQuery, FileQuery};

use sea_orm::{Database, DatabaseConnection};
use serde::Deserialize;

#[derive(Clone)]
struct ServerState {
    conn: DatabaseConnection,
}

async fn index() -> String {
    "".to_string()
}

async fn status() -> String {
    "".to_string()
}

const SIGNATURE_END: &str = "-----END PGP SIGNATURE-----";

// async fn file(
//     State(state): State<ServerState>,
//     query: Query<FileQuery>,
// ) -> Result<Json<BlobObjects>, (StatusCode, String)> {
//     let blob_data = match get_obj_data_by_id(&state.conn, &query.object_id).await {
//         Ok(Some(node)) => {
//             if node.object_type == "blob" {
//                 node.data
//             } else {
//                 return Err((StatusCode::NOT_FOUND, "Blob not found".to_string()));
//             }
//         }
//         _ => return Err((StatusCode::NOT_FOUND, "Blob not found".to_string())),
//     };

//     let row_data = match String::from_utf8(blob_data) {
//         Ok(str) => str,
//         _ => {
//             return Err((
//                 StatusCode::INTERNAL_SERVER_ERROR,
//                 "Can not convert blob to readable txt".to_string(),
//             ))
//         }
//     };

//     let data = BlobObjects { row_data };
//     Ok(Json(data))
// }

async fn file(
    State(state): State<ServerState>,
    query: Query<FileQuery>,
) -> Result<Json<BlobObjects>, (StatusCode, String)> {
    let blob_data = match get_obj_data_by_id(&state.conn, &query.object_id).await {
        Ok(Some(node)) => {
            if node.object_type == "blob" {
                node.data
            } else {
                return Err((StatusCode::NOT_FOUND, "Blob not found".to_string()));
            }
        }
        _ => return Err((StatusCode::NOT_FOUND, "Blob not found".to_string())),
    };

    let row_data = match String::from_utf8(blob_data) {
        Ok(str) => str,
        _ => {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                "Can not convert blob to readable txt".to_string(),
            ))
        }
    };

    let data = BlobObjects { row_data };
    Ok(Json(data))
}

async fn tree(
    State(state): State<ServerState>,
    directory_query: Query<DirectoryQuery>,
) -> Result<Json<Directories>, (StatusCode, String)> {
    if let Some(obj_id) = &directory_query.object_id {
        get_tree_objects(&state.conn, &obj_id).await
    } else {
        let directory = get_directory_by_full_path(&state.conn, &directory_query.repo_path)
            .await
            .unwrap();
        match directory {
            Some(dir) => {
                if dir.is_repo {
                    // find commit by path
                    let commit_id = match search_refs(&state.conn, &directory_query.repo_path).await
                    {
                        Ok(refs) if !refs.is_empty() => refs[0].ref_git_id.clone(),
                        _ => {
                            return Err((
                                StatusCode::NOT_FOUND,
                                "repo_path might not valid".to_string(),
                            ))
                        }
                    };
                    // find tree by commit
                    let tree_id = match get_commit_by_hash(&state.conn, &commit_id).await {
                        Ok(Some(commit)) => commit.tree,
                        _ => return Err((StatusCode::NOT_FOUND, "Tree not found".to_string())),
                    };
                    get_tree_objects(&state.conn, &tree_id).await
                } else {
                    // let dirs = self.storage.get_directory_by_pid(dir.id).await.unwrap();
                    // let items = dirs.into_iter().map(|x| x.into()).collect();
                    let data = Directories { items: vec![] };
                    Ok(Json(data))
                }
            }
            None => Err((
                StatusCode::NOT_FOUND,
                "repo_path might not valid".to_string(),
            )),
        }
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let db_url = "postgres://nieyuting:nieyuting@127.0.0.1/mega";
    let connection = Database::connect(db_url)
        .await
        .expect("Database connection failed");
    let server_url = format!("{}:{}", "127.0.0.1", "8000");

    let state = ServerState { conn: connection };

    let app = Router::new()
        .route("/", get(index))
        .route("/api/v1/status", get(status))
        .route("/api/v1/tree", get(tree))
        .route("/api/v1/blob", get(file))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind(&server_url).await.unwrap();
    axum::serve(listener, app).await?;

    Ok(())
}

use crate::internal::object::tree::Tree;
use crate::internal::object::ObjectT;
use model::objects::Directories;
use model::objects::{BlobObjects, Item};
use std::collections::HashMap;
pub async fn get_tree_objects(
    conn: &DatabaseConnection,
    object_id: &str,
) -> Result<Json<Directories>, (StatusCode, String)> {
    let tree_data = match get_obj_data_by_id(conn, object_id).await {
        Ok(Some(node)) => {
            if node.object_type == "tree" {
                node.data
            } else {
                return Err((StatusCode::NOT_FOUND, "Tree not found".to_string()));
            }
        }
        _ => return Err((StatusCode::NOT_FOUND, "Tree not found".to_string())),
    };

    let tree = Tree::new_from_data(tree_data);
    let child_ids = tree
        .tree_items
        .iter()
        .map(|tree_item| tree_item.id.to_plain_str())
        .collect();

    let child_nodes = get_nodes_by_hashes(conn, child_ids).await.unwrap();

    let mut items: Vec<Item> = child_nodes
        .iter()
        .map(|node| Item::from(node.clone()))
        .collect();
    let related_commit_ids = child_nodes.into_iter().map(|x| x.last_commit).collect();
    let related_c = get_commit_by_hashes(conn, related_commit_ids)
        .await
        .unwrap();
    let mut related_c_map: HashMap<String, internal::object::commit::Commit> = HashMap::new();
    for c in related_c {
        related_c_map.insert(c.git_id.clone(), c.into());
    }

    for item in &mut items {
        let related_c_id = item.commit_id.clone().unwrap();
        let commit = related_c_map.get(&related_c_id).unwrap();
        item.commit_msg = Some(remove_useless_str(
            commit.message.clone(),
            SIGNATURE_END.to_owned(),
        ));
        item.commit_date = Some(commit.committer.timestamp.to_string());
    }

    let data = Directories { items };
    Ok(Json(data))
}
fn remove_useless_str(content: String, remove_str: String) -> String {
    if let Some(index) = content.find(&remove_str) {
        let filtered_text = &content[index + remove_str.len()..].replace('\n', "");
        let truncated_text = filtered_text.chars().take(50).collect::<String>();
        truncated_text.to_owned()
    } else {
        "".to_owned()
    }
}

use sea_orm::ColumnTrait;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
async fn get_obj_data_by_id(
    conn: &DatabaseConnection,
    git_id: &str,
) -> Result<Option<entity::objects::Model>, common::errors::MegaError> {
    let obj = entity::objects::Entity::find()
        .filter(entity::objects::Column::GitId.eq(git_id))
        .one(conn)
        .await
        .unwrap();

    if let Some(model) = obj {
        return Ok(Some(model));
    }
    Ok(None)
}

async fn get_nodes_by_hashes(
    conn: &DatabaseConnection,
    hashes: Vec<String>,
) -> Result<Vec<entity::node::Model>, common::errors::MegaError> {
    Ok(
        batch_query_by_columns::<entity::node::Entity, entity::node::Column>(
            conn,
            entity::node::Column::GitId,
            hashes,
        )
        .await
        .unwrap(),
    )
}

async fn batch_query_by_columns<T, C>(
    connection: &DatabaseConnection,
    column: C,
    ids: Vec<String>,
) -> Result<Vec<T::Model>, common::errors::MegaError>
where
    T: EntityTrait,
    C: ColumnTrait,
{
    let mut result = Vec::<T::Model>::new();
    for chunk in ids.chunks(1000) {
        result.extend(
            T::find()
                .filter(column.is_in(chunk))
                .all(connection)
                .await
                .unwrap(),
        );
    }
    Ok(result)
}
async fn get_commit_by_hash(
    conn: &DatabaseConnection,
    hash: &str,
) -> Result<Option<entity::commit::Model>, common::errors::MegaError> {
    Ok(entity::commit::Entity::find()
        .filter(entity::commit::Column::GitId.eq(hash))
        .one(conn)
        .await
        .unwrap())
}

async fn get_commit_by_hashes(
    conn: &DatabaseConnection,
    hashes: Vec<String>,
) -> Result<Vec<entity::commit::Model>, common::errors::MegaError> {
    Ok(
        batch_query_by_columns::<entity::commit::Entity, entity::commit::Column>(
            conn,
            entity::commit::Column::GitId,
            hashes,
        )
        .await
        .unwrap(),
    )
}
use sea_orm::error::DbErr;
async fn get_directory_by_full_path(
    conn: &DatabaseConnection,
    path: &str,
) -> Result<Option<entity::repo_directory::Model>, DbErr> {
    entity::repo_directory::Entity::find()
        .filter(entity::repo_directory::Column::FullPath.eq(path))
        .one(conn)
        .await
}

use sea_orm::{DatabaseBackend, Statement};
async fn search_refs(
    conn: &DatabaseConnection,
    path_str: &str,
) -> Result<Vec<entity::refs::Model>, common::errors::MegaError> {
    Ok(entity::refs::Entity::find()
        .from_raw_sql(Statement::from_sql_and_values(
            DatabaseBackend::Postgres,
            r#"SELECT * FROM refs where $1 LIKE CONCAT(repo_path, '%') "#,
            [path_str.into()],
        ))
        .all(conn)
        .await?)
}
