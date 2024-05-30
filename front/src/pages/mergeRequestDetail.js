import { ClockCircleOutlined } from "@ant-design/icons/lib";
import { Timeline } from "antd/lib";
import 'github-markdown-css/github-markdown-light.css';
import { useRouter } from 'next/router';
import { Highlight } from "prism-react-renderer";
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import Bottombar from "../components/Bottombar";
import TopNavbar from "../components/TopNavbar";
import "../styles/index.css";
import "../styles/mergeRequestDetail.css";

const mergeRequestDetail = () => {

  const router = useRouter();
  const { userId } = router.query;
  const MEGA_URL = 'http://localhost:8000';

  const data = [
    {
      key: '1',
      mergeStatus: 'open',
      mergeTime: 'Mar 25',
      mergeTitle: 'Bump webpack-dev-middleware from 5.3.3 to 5.3.4 in /archived/ui',
      tags: ['documentation', 'bug'],
      author: 'Alice',
      userId: '59sj4jfs',
    },
    {
      key: '2',
      mergeStatus: 'closed',
      mergeTime: 'Apr 8',
      mergeTitle: 'Update russh-keys requirement from 0.42.0 to 0.43.0',
      tags: ['good first issue', 'refactoring'],
      author: 'Bob',
      userId: '48sjf4n',
    },
    {
      key: '3',
      mergeStatus: 'open',
      mergeTime: 'Feb 6',
      mergeTitle: 'Sydney No. 1 Lake Park',
      tags: ['invalid'],
      author: 'Charlie',
      userId: '9ejrf35',
    },
    {
      key: '4',
      mergeStatus: 'closed',
      mergeTime: 'Feb 18',
      mergeTitle: 'London No. 2 Lake ParkUpdate reqwest requirement from 0.11.23 to 0.12.0',
      tags: ['rust', 'Kitex', 'Netpoll'],
      author: 'David',
      userId: 'ck49d34k',
    },
    {
      key: '5',
      mergeStatus: 'open',
      mergeTime: 'Jan 6',
      mergeTitle: 'Allow custom registry to get the actual address for registering',
      tags: ['Volo', 'javascript'],
      author: 'Eve',
      userId: '5346f4rx',
    },
    {
      key: '6',
      mergeStatus: 'open',
      mergeTime: 'Jan 11',
      mergeTitle: '[DO NOT MERGE]docs: add util & merged hertz docs ',
      tags: ['community', 'Netpoll'],
      author: 'Frank',
      userId: 'm34k3ddf',
    },
    {
      key: '7',
      mergeStatus: 'closed',
      mergeTime: 'Dec 21, 2023',
      mergeTitle: 'feat: add receive all the metainfo api',
      tags: ['help wanted', 'website'],
      author: 'Grace',
      userId: '32047fn',
    },
  ];

  // const currentMR = data.find(item => item.userId === userId);

  const currentMR = {
    key: '7',
    mergeStatus: 'closed',
    mergeTime: 'Dec 13, 2023',
    mergeTitle: 'Bump webpack-dev-middleware from 5.3.3 to 5.3.4 in /archived/ui',
    tags: ['help wanted', 'website'],
    author: 'Grace',
    userId: '32047fn',
  };

  console.log(currentMR);

  const simulateData = {
    CommitID: currentMR.userId,
    title: currentMR.mergeTitle,
    targetBranch: "open-rust-initiative:main",
    sourceBransh: "xizheyin:main",
    MRStatus: currentMR.mergeStatus,
    accessPeople: "geneda",
    author: currentMR.author,
    addedLines: 23,
    deletedLines: 9,
    Conversations: [
      {
        author: "gaopu",
        order: 1,
        time: "2024/01/15",
        content:
          `
## Updates the requirements on git2-curl to permit the latest version.

- Changelog
- Commits

Dependabot will resolve any conflicts with this PR as long as you don't alter it yourself. You can also trigger a rebase manually by commenting @dependabot rebase.
`,
        type: "comment",
        commitsAcount: 5,
        avatar: 'gaopu',
      },
      {
        author: "gaopu",
        order: 2,
        time: "2024/01/17",
        content: "Update git2-curl requirement from 0.17 to 0.18 ",
        type: "commit",
        avatar: 'gaopu',
      },

      {
        author: "gaopu",
        order: 3,
        time: "2024/01/17",
        content: "added the dependencies label on Apr 3, 2023",
        type: "commit",
        avatar: 'gaopu',
      },
      {
        author: "genedna",
        order: 5,
        time: "2024/01/18",
        type: "comment",
        content:
          "Dependabot tried to update this pull request, but something **went wrong**. We're looking into it, but in the meantime you can retry the update by commenting @dependabot rebase.",
        commitsAcount: 1,
        avatar: 'genedna',

      },
      {
        author: "genedna",
        order: 6,
        time: "2024/01/19",
        content: "approved these changes",
        type: "approved", // when approved, the content always are "these changes"
        avatar: 'genedna',
      },

      {
        author: "genedna",
        order: 7,
        time: "2024/01/20",
        content: "merged commit 4bb83hd",
        type: "merged",
        avatar: 'genedna',
      },
    ],
  };

  const fileChanges = {

    'c3d765030fbb7faaf3383cd7a42dde69ac53eede': {
      fileName: 'mod.rs',
      filePath: '/projects/freighter/src/hander/channel.rs',
      changes: [
        {
          type: 'added',
          startLine: 8,
          code: `
use crate::{
    cloud::{s3::S3cmd, CloudStorage},
    config::{ProxyConfig, RustUpConfig},
    download::{download_and_check_hash, download_file_with_sha, DownloadOptions},
    errors::{FreightResult, FreighterError},
};
`,
        },
        {
          type: 'removed',
          startLine: 15,
          endLine: 18,
        },
        {
          type: 'added',
          startLine: 47,
          code: `
             pub available: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
`,
        },
        {
          type: 'removed',
          startLine: 78,
          endLine: 50,
        },
      ],
    },

    '2f355006fb7718cb266255965651a09288a80b2a': {
      fileName: 'config.rs',
      filePath: '/projects/freighter/src/config.rs',
      addedLines: {
        startLine: 20,
        code: `
      const greeting = 'Hello, world!';
      console.log(greeting);
      `,
      },
      removedLines: {
        startLine: 18,
        code: `
      console.log('Hello!');
      `,
      },
    },
  };



  const [showFileChange, setshowFileChange] = useState(false);


  const ChangedFiles = `
    use std::{
    collections::HashMap,
    fs::{self, DirEntry},
    path::{Path, PathBuf},
    sync::Arc,
};

use chrono::{Duration, NaiveDate, Utc};
use rayon::{
    prelude::{IntoParallelRefIterator, ParallelIterator},
    ThreadPool, ThreadPoolBuilder,
};
use serde::Deserialize;
use url::Url;
use walkdir::WalkDir;

#[derive(Debug, Deserialize)]
pub struct Channel {
    #[serde(alias = "manifest-version")]
    pub manifest_version: String,
    pub date: String,
    pub pkg: HashMap<String, Pkg>,
}

#[derive(Debug, Deserialize)]
pub struct Pkg {
    pub version: String,
    pub target: HashMap<String, Target>,
}

#[derive(Debug, Deserialize)]
pub struct Target {
    pub available: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hash: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub xz_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub xz_hash: Option<String>,
}

#[derive(Debug, Clone)]
pub struct ChannelOptions {
    pub config: RustUpConfig,

    pub proxy: ProxyConfig,

    /// Whether to clean historical versions.
    pub clean: bool,
    /// only sync that version
    pub version: Option<String>,

    pub dist_path: PathBuf,

    pub bucket: Option<String>,

    pub upload: bool,

    pub delete_after_upload: bool,

    pub sync_history: bool,

    pub init: bool,

    pub thread_pool: Arc<ThreadPool>,
}

impl Default for ChannelOptions {
    fn default() -> Self {
        let thread_pool = Arc::new(ThreadPoolBuilder::new().build().unwrap());
        ChannelOptions {
            thread_pool,
            config: RustUpConfig::default(),
            proxy: ProxyConfig::default(),
            clean: false,
            version: None,
            dist_path: PathBuf::default(),
            bucket: None,
            upload: false,
            delete_after_upload: false,
            sync_history: false,
            init: false,
        }
    }
}

/// entrance function
pub fn sync_rust_toolchain(opts: &ChannelOptions) -> FreightResult {
    let config = &opts.config;
    if let Some(version) = &opts.version {
        // step 1 : sync specified channel version
        sync_channel(opts, version)?;
    } else if opts.sync_history {
        // step 2: sync historical nightly and beta versions
        if let Some(date) = config.history_version_start_date.clone() {
            let start_date = NaiveDate::parse_from_str(&date, "%Y-%m-%d").unwrap();
            tracing::info!(
                "step 2: sync historical nightly and beta versions from {}",
                start_date
            );
            let today = Utc::now().date_naive();
            if today >= start_date {
                let duration_days = (today - start_date).num_days().try_into().unwrap();
                for day in start_date.iter_days().take(duration_days) {
                    sync_channel(opts, &format!("beta-{}", day))?;
                    sync_channel(opts, &format!("nightly-{}", day))?;
                }
            } else {
                tracing::error!("start date {} is after today {}", start_date, today);
            }
        }
    } else {
        // step 3.1: sync latest stable, beta and nightly channel
        tracing::info!("step 3.1: sync latest stable, beta and nightly channel");
        sync_channel(opts, "stable")?;
        sync_channel(opts, "beta")?;
        sync_channel(opts, "nightly")?;
        if opts.init {
            // step 3.2: sync specified channel version by config file
            tracing::info!("step 3.2:(optional) sync specified channel version by config file");
            config.sync_stable_versions.iter().for_each(|channel| {
                sync_channel(opts, channel).unwrap();
            });
        }
    }
    // step 3: clean local historical channel files if needed
    if opts.clean {
        let channels = [
            ("beta", config.sync_beta_days),
            ("nightly", config.sync_nightly_days),
        ];
        for channel in channels {
            clean_historical_version(&opts.dist_path, channel).unwrap();
        }
    }
    Ok(())
}

// sync the latest toolchain by given a channel name(stable, beta, nightly) or history version by version number
pub fn sync_channel(opts: &ChannelOptions, channel: &str) -> FreightResult {
    let channel_name;
    let channel_url;
    let channel_folder;
    tracing::info!("starting download channel: {}", channel);
    if let Some(date) = channel.strip_prefix("nightly-") {
        channel_name = String::from("channel-rust-nightly.toml");
        channel_url = format!("{}/dist/{}/{}", opts.config.domain, date, channel_name);
        channel_folder = opts.dist_path.to_owned().join(date);
    } else if let Some(date) = channel.strip_prefix("beta-") {
        channel_name = String::from("channel-rust-beta.toml");
        channel_url = format!("{}/dist/{}/{}", opts.config.domain, date, channel_name);
        channel_folder = opts.dist_path.to_owned().join(date);
    } else {
        channel_name = format!("channel-rust-{}.toml", channel);
        channel_url = format!("{}/dist/{}", opts.config.domain, channel_name);
        channel_folder = opts.dist_path.to_owned();
    }
    match download_file_with_sha(&channel_url, &channel_folder, &channel_name, &opts.proxy) {
        Ok(res) => {
            let channel_toml = &channel_folder.join(channel_name);
            if !res && !channel_toml.exists() {
                tracing::error!("skipping channel: {}", channel);
                return Ok(());
            }
            // parse_channel_file and download;
            let download_list = parse_channel_file(channel_toml).unwrap();
            let s3cmd = Arc::new(S3cmd::default());
            opts.thread_pool.install(|| {
                download_list.par_iter().for_each(|(url, hash)| {
                    // example: https://static.rust-lang.org/dist/2022-11-03/rust-1.65.0-i686-pc-windows-gnu.msi
                    // these code was used to remove url prefix "https://static.rust-lang.org/dist"
                    // and get "2022-11-03/rust-1.65.0-i686-pc-windows-gnu.msi"
                    let path: PathBuf = std::iter::once(opts.dist_path.to_owned())
                        .chain(
                            url.split('/').map(PathBuf::from).collect::<Vec<PathBuf>>()[4..]
                                .to_owned(),
                        )
                        .collect();
                    let (upload, dist_path, bucket, delete_after_upload) = (
                        opts.upload,
                        opts.dist_path.to_owned(),
                        opts.bucket.to_owned(),
                        opts.delete_after_upload,
                    );

                    let mut url = Url::parse(url).unwrap();
                    url.set_host(Url::parse(&opts.config.domain).unwrap().host_str())
                        .unwrap();

                    let down_opts = &DownloadOptions {
                        proxy: opts.proxy.clone(),
                        url,
                        path,
                    };
                    let path = &down_opts.path;
                    let downloaded = download_and_check_hash(down_opts, Some(hash), false).unwrap();
                    if downloaded && upload {
                        let s3_path = format!(
                            "dist{}",
                            path.to_str()
                                .unwrap()
                                .replace(dist_path.to_str().unwrap(), "")
                        );
                        let uploaded = s3cmd.upload_file(path, &s3_path, &bucket.unwrap());
                        if uploaded.is_ok() && delete_after_upload {
                            fs::remove_file(path).unwrap();
                        }
                    };
                });
            });

            replace_toml_and_sha(opts, s3cmd, channel_toml);
        }
        Err(_err) => {
            tracing::info!("skipping download channel:{}", channel);
        }
    }
    Ok(())
}

// upload toml file and sha256 after all files handle success
pub fn replace_toml_and_sha(opts: &ChannelOptions, s3cmd: Arc<S3cmd>, channel_toml: &Path) {
    let shafile = channel_toml.with_extension("toml.sha256");
    let files: Vec<&Path> = vec![channel_toml, &shafile];
    if opts.upload {
        for file in files {
            let s3_path = format!(
                "dist{}",
                file.to_str()
                    .unwrap()
                    .replace(opts.dist_path.to_str().unwrap(), "")
            );
            s3cmd
                .upload_file(file, &s3_path, &opts.bucket.clone().unwrap())
                .unwrap();
        }
    }
}
// parse channel file to get download url and hash
pub fn parse_channel_file(path: &Path) -> Result<Vec<(String, String)>, FreighterError> {
    let content = fs::read_to_string(path).unwrap();
    let channel: Channel = toml::from_str(&content).unwrap();
    let res: Vec<(String, String)> = channel
        .pkg
        .into_iter()
        .flat_map(|(_, pkg)| {
            pkg.target
                .into_iter()
                .flat_map(|(_, target)| -> Vec<(String, String)> {
                    let mut result: Vec<(String, String)> = Vec::new();
                    if target.xz_url.is_some() && target.xz_hash.is_some() {
                        result.push((target.xz_url.unwrap(), target.xz_hash.unwrap()));
                    }
                    if target.url.is_some() && target.hash.is_some() {
                        let url = target.url.unwrap();
                        let hash = target.hash.unwrap();
                        if !url.is_empty() && !hash.is_empty() {
                            result.push((url, hash));
                        }
                    }
                    result
                })
        })
        .collect();
    Ok(res)
}

pub fn clean_historical_version(dist_path: &PathBuf, channels: (&str, i64)) -> FreightResult {
    let (channel, sync_days) = channels;
    // filter dir less than sync_nightly_days ago
    fs::read_dir(dist_path)
        .unwrap()
        .filter_map(|v| v.ok())
        .filter(|entry| compare_date(entry, sync_days))
        .for_each(|entry| {
            WalkDir::new(entry.path())
                .into_iter()
                .filter_map(|f| f.ok())
                .for_each(|entry| {
                    let file_name = entry.file_name().to_str().unwrap();
                    if file_name.contains(channel) {
                        fs::remove_file(entry.path()).unwrap();
                        tracing::info!("!!![REMOVE] \t\t {:?} !", entry.path());
                    }
                });
            // remove whole directory when it's empty
            if entry.path().read_dir().unwrap().next().is_none() {
                fs::remove_dir_all(entry.path()).unwrap();
                tracing::info!("!!![REMOVE] \t\t {:?} !", entry.path());
            }
        });

    Ok(())
}

pub fn compare_date(entry: &DirEntry, sync_days: i64) -> bool {
    if entry.file_type().unwrap().is_dir() {
        let date = match NaiveDate::parse_from_str(entry.file_name().to_str().unwrap(), "%Y-%m-%d")
        {
            Ok(date) => date,
            Err(_) => {
                tracing::error!(
                    "can't parse dir :{} and skipping... ",
                    entry.path().display()
                );
                return false;
            }
        };
        Utc::now().date_naive() - date > Duration::days(sync_days)
    } else {
        false
    }
}
    ` ;



  const getChanges = (fileChanges, fileId) => {
    const changes = fileChanges[fileId].changes;
    const added = [];
    const removed = [];

    let lineOffset = 0; // 在添加和删除行时动态调整起始行号，以反映出这些变更对后续行号的影响。

    changes.forEach(change => {
      if (change.type === 'added') {
        const lines = change.code.trim().split('\n');
        const startLine = change.startLine - 1 + lineOffset;
        for (let i = 0; i < lines.length; i++) {
          added.push({ line: startLine + i, content: lines[i] });
        }
        lineOffset += lines.length;
      } else if (change.type === 'removed') {
        const startLine = change.startLine - 1 + lineOffset;
        const endLine = change.endLine - 1 + lineOffset;
        for (let i = startLine; i <= endLine; i++) {
          removed.push(i);
        }
        lineOffset -= (endLine - startLine + 1);
      }
    });

    return { added, removed };
  };

  const { added, removed } = getChanges(fileChanges, 'c3d765030fbb7faaf3383cd7a42dde69ac53eede');


  const fetchFileContent = async (key) => {
    try {
      const response = await fetch(`${MEGA_URL}/api/v1/blob?object_id=${key}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tree data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tree data:', error);
      return null;
    }
  };

  const handleFilesChangedButton = () => {
    setshowFileChange(true);
  }





  const TimelineWithCustomContent = ({ data }) => {
    return (
      <div className="conversiations">
        {!showFileChange && (
          <Timeline>
            {data
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <Timeline.Item key={index}>
                  <div>
                    {item.type === "comment" && (
                      <div className="MRCommentNode">
                        <img
                          className="MRCommentHeadImage"
                          src={`/images/${item.avatar}.png`}
                        ></img>

                        <div style={{ border: '2px solid #ddd', borderRadius: '15px', marginLeft: '10px', width: '100 %' }}>
                          <div className="commentHeader">
                            <span style={{ fontWeight: 'bold' }}>{item.author}</span>
                            <span> - {item.time}</span>
                          </div>
                          <div className="commentContent">
                            <Markdown>{item.content}</Markdown>
                          </div>
                        </div>
                      </div>


                    )}

                    {item.type != "comment" && (
                      <div className="MRCommitNode">
                        <img
                          className="MRNormalHeadImage"
                          src={`/images/${item.avatar}.png`}
                        ></img>
                        <div className="MRAuthor" style={{ fontWeight: 'bold' }}>{`${item.author}`}&nbsp;</div>
                        <div className="normalContent">{`${item.content} `}{`${item.time}`}</div>

                      </div>
                    )}


                  </div>
                </Timeline.Item>
              ))}
          </Timeline>
        )}

        {showFileChange && (
          < div >

            <div style={{ border: '2px solid #ddd', borderRadius: '15px', marginLeft: '10px', width: '100 %' }}>
              <div className="changeHeader">
                <span style={{ fontWeight: 'bold', color: 'white', marginLeft: '20px' }}>{fileChanges["c3d765030fbb7faaf3383cd7a42dde69ac53eede"].fileName}</span>
                <span style={{ color: 'rgba(210, 209, 209, 0.806)', marginLeft: '70%' }}>{fileChanges["c3d765030fbb7faaf3383cd7a42dde69ac53eede"].filePath}</span>
                <span style={{ marginLeft: '20px' }}>
                  <span id="addedLines">+{simulateData.addedLines} &nbsp;</span>
                  <span id="deletedLines">-{simulateData.deletedLines}</span>
                </span>
              </div>
              <div className="changeContent">
                <Highlight
                  className="rust"
                  code={ChangedFiles}
                  language="rust"
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre style={style} className="codeShowContainer">
                      {tokens.map((line, i) => {
                        const lineProps = getLineProps({ line });
                        let lineStyle = {};
                        let linePrefix = '';
                        let lineContent = line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ));

                        if (removed.includes(i)) {
                          lineStyle = { backgroundColor: 'rgb(248, 9, 9, 0.2)' };
                          linePrefix = '- ';
                        }

                        const addedLine = added.find(add => add.line === i);
                        if (addedLine) {
                          lineStyle = { backgroundColor: 'rgb(42, 183, 42, 0.2)' };
                          linePrefix = '+ ';
                          lineContent = [<span key="added">{addedLine.content}</span>];
                        }

                        return (
                          <React.Fragment key={i}>
                            <div {...lineProps} style={lineStyle}>
                              <span className="codeLineNumber">{i + 1}</span>
                              <span>{linePrefix}</span>
                              {lineContent}
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </pre>
                  )}
                </Highlight>
              </div>
            </div>

          </div>
        )
        }
      </div >
    );
  };

  console.log(ChangedFiles);

  const timeLineSimulat = [
    {
      children: "Create a services site 2015-09-01",
    },
    {
      children: "Solve initial network problems 2015-09-01",
    },
    {
      dot: <ClockCircleOutlined className="timeline-clock-icon" />,
      color: "red",
      children: "Technical testing 2015-09-01",
    },
    {
      children: "Network problems being solved 2015-09-01",
    },
  ];


  return (
    <div>
      <div>
        <TopNavbar />
        <div id="mergeRequestContent">
          <div className="MRTopLevel">
            <h1 id="MRTitle">{simulateData.title}</h1>
            {simulateData.MRStatus === "closed" && (
              <div id="MRStatus">
                <img src="/icons/Merged.svg" className="mergedStatusIcon"></img>
                <p>merged</p>

                <div id="MRStatusSubtitle">
                  {simulateData.accessPeople} merged commits
                  into{" "}
                  <span className="MRBranch">{simulateData.targetBranch}</span>{" "}
                  from{" "}
                  <span className="MRBranch">{simulateData.targetBranch}</span>{" "}
                  3 month age
                </div>
              </div>
            )}
            {simulateData.MRStatus === "open" && (
              <div id="MRStatus">
                <img src="/icons/merge.svg" className="mergedStatusIcon"></img>
                <p>open</p>

                <div id="MRStatusSubtitle">
                  {simulateData.accessPeople} wants to merge commits
                  into{" "}
                  <span className="MRBranch">{simulateData.targetBranch}</span>{" "}
                  from{" "}
                  <span className="MRBranch">{simulateData.targetBranch}</span>{" "}
                  2 weeks age
                </div>
              </div>
            )}
          </div>
          <div id="MRBottomLevel">
            <ul id="MRFunctionButtons">
              <li className="MRFunctionButtonsList">
                <img
                  src="/icons/social_massage_group_02.svg"
                  className="MRFunctionButtonsIcon"
                ></img>
                <button className="MRDetailButton">Conversation</button>
                <span className="conversationAcount">4</span>
              </li>
              <li className="MRFunctionButtonsList">
                <img
                  src="/icons/git-commit.svg"
                  className="MRFunctionButtonsIcon"
                ></img>
                <button className="MRDetailButton">Commits</button>
                <span className="conversationAcount">3</span>
              </li>
              <li className="MRFunctionButtonsList">
                <img
                  src="/icons/16gl-plusMinus.svg"
                  className="MRFunctionButtonsIcon"
                ></img>
                <button className="MRDetailButton" onClick={() => handleFilesChangedButton()}>Files changed</button>
                <span className="conversationAcount">1</span>
              </li>
              <li className="MRFunctionButtonsList MRFunctionLineChanges">
                <span id="addedLines">+{simulateData.addedLines} &nbsp;</span>
                <span id="deletedLines">-{simulateData.deletedLines}</span>
              </li>
            </ul>
            <TimelineWithCustomContent
              id="timeLineBox"
              data={simulateData.Conversations}
            />
          </div>
        </div>
        <Bottombar />
      </div>
    </div>
  );
};
export default mergeRequestDetail;
