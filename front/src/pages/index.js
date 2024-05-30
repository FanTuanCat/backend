import Editor from '@/components/editor/Editor';
import { DownOutlined } from '@ant-design/icons/lib';
import { Breadcrumb, Tree } from 'antd/lib';
import axios from 'axios';
import 'github-markdown-css/github-markdown-light.css';
import { useRouter } from 'next/router';
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import Markdown from 'react-markdown';
import Bottombar from '../components/Bottombar';
import TopNavbar from '../components/TopNavbar';
import '../styles/index.css';

const HomePage = ({ rootDirectory, directory, readmeContent, fileContent, TreeData }) => {

    const MEGA_URL = 'http://localhost:8000';
    const router = useRouter();
    const currentProjectDir = directory.items || [];
    const [showEditor, setShowEditor] = useState(false);
    const [showTree, setShowTree] = useState(false);
    const [treeData, setTreeData] = useState("freighter");
    const [updateTree, setUpdateTree] = useState(false);
    const [currentPath, setCurrentPath] = useState(["freighter"]); // for breadcrumb
    const { DirectoryTree } = Tree;
    const [expandedKeys, setExpandedKeys] = useState([]);
    const changedLine = [14, 22, 25];
    const [currentLineIndex, setCurrentLineIndex] = useState(null);
    const [fileBlameContent, setFileBlameContent] = useState({
        14: {
            user: ' vinci',
            userId: 'user1',
            avatar: 'vinci',
            time: '2024-05-03 10:43:13',
            content: 'I think this command is too *short*, may be you should add more comment. '
        },
        22: {
            user: 'Tomsun',
            userId: 'user2',
            avatar: 'Tomsun',
            time: '2023-05-11 18:24:09',
            content: `
## Functionality

The \`cli\` module houses the \`main\` function.

\`&mut config\` passes a mutable reference to \`config\` to the \`main\` function, allowing \`config\` to be modified within it.

## Improvements
- **Error Handling**: If \`cli::main\` may return a \`Result\` type (\`Result<T, E>\`), error handling should be implemented.
- **Documentation**: Adding comments to explain the purpose of this code and the functionality of the \`main\` function would enhance readability.
a`

        },
        25: {
            user: 'XiaoBao',
            userId: 'user3',
            avatar: 'XiaoBao',
            time: '2023-05-22 02:04:54',
            content: `## Error Handling
The provided code snippet utilizes Rust's pattern matching (\`if let\`) to handle potential errors returned by the \`result\` variable. 
- If \`result\` is an \`Err\`, the associated error value \`e\` will be bound to the variable.
- Inside the block associated with the \`Err\` variant, \`e.print()\` is called to print out the error. 
`
        }
    });

    const fileCodeContainerStyle = showTree ? { width: '80%', marginLeft: '17%', borderRadius: '0.5rem', marginTop: '10px' } : { width: '90%', margin: '0 auto', borderRadius: '0.5rem', marginTop: '10px', marginTop: '40px' };
    const dirShowTrStyle = { borderBottom: '1px solid  rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(227, 239, 249, 0.114)' }
    const [highlightKey, setHighlightKey] = useState(Date.now());

    useEffect(() => {
        setTreeData(convertToTreeData(rootDirectory.items));
    }, []);

    useEffect(() => {
        if (updateTree) {
            setUpdateTree(false);
        }
    }, [updateTree]);

    const handleLineNumberClick = (lineIndex) => {
        if (isBlameView) {
            setExpandedLine(expandedLine === lineIndex ? null : lineIndex);
        } else {
            setCurrentLineIndex(lineIndex);
            setShowEditor(!showEditor);
            const lineNumberButton = document.getElementsByClassName('codeLineNumber')[lineIndex - 1];
            const codeLineNumber = lineNumberButton.closest('.token-line');
            if (showEditor) {
                const editorContainer = document.createElement('div');
                editorContainer.className = 'editor-container';

                // render the Editor into the container
                ReactDOM.render(
                    <Editor
                        fileBlameContent={fileBlameContent}
                        setFileBlameContent={(newContent) => {
                            setFileBlameContent(newContent);
                            setHighlightKey(Date.now()); // 强制重新渲染
                        }}
                        lineIndex={lineIndex}
                        onCloseEditor={() => {
                            const editorContainer = document.querySelector('.editor-container');
                            if (editorContainer) {
                                editorContainer.parentNode.removeChild(editorContainer);
                            }
                            setShowEditor(false); // 关闭编辑器后设置 showEditor 为 false
                        }}
                    />,
                    editorContainer
                );
                codeLineNumber.appendChild(editorContainer, codeLineNumber);
            } else {
                const editorContainer = document.querySelector('.editor-container');
                if (editorContainer) {
                    editorContainer.parentNode.removeChild(editorContainer);
                }
            }
        }
    };


    console.log(fileBlameContent);

    const handleFileClick = (file) => {
        setShowTree(true);
        router.push(`/?object_id=${file.id}`);
        const newPath = [];
        for (let i = 0; i < currentPath.length; i++) {
            newPath.push(currentPath[i]);
        }
        newPath.push(file.name);
        setCurrentPath(newPath);

    };

    const handleDirectoryClick = async (directory) => {
        router.push(`/?repo_path=/projects/freighter&object_id=${directory.id}`);
        setShowTree(true);

        try {
            const response = await fetch(`/api/tree?repo_path=/projects/freighter&object_id=${encodeURIComponent(directory.id)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch tree data');
            }

            const responseData = await response.json();
            console.log('Response data:', responseData);

            const subTreeData = convertToTreeData(responseData.items);
            const newTreeData = appendTreeData(treeData, subTreeData, directory.id);
            setTreeData(newTreeData);
            setUpdateTree(true);

            const newExpandedKeys = [];
            for (let i = 0; i < expandedKeys.length; i++) {
                newExpandedKeys.push(expandedKeys[i]);
            }
            newExpandedKeys.push(directory.id);
            setExpandedKeys(newExpandedKeys);

            const newPath = [];
            for (let i = 0; i < currentPath.length; i++) {
                newPath.push(currentPath[i]);
            }
            newPath.push(directory.name);
            setCurrentPath(newPath);
            // for breadcrumb
            console.log(newTreeData);
            console.log(treeData);
        } catch (error) {
            console.error('Error fetching tree data:', error);
        }
    };

    const handleGoBack = () => {
        console.log(expandedKeys[currentPath.length - 2]);
        console.log(TreeData[expandedKeys[currentPath.length - 2]]);
        if (TreeData[expandedKeys[currentPath.length - 2]]) {
            setTreeData(TreeData[expandedKeys[currentPath.length - 2]].expanded == true);
        }
        handleBreadcrumbClick(currentPath.length - 3, expandedKeys[currentPath.length - 3]);
    };

    // sort by file type, render folder type first
    const sortedProjects = currentProjectDir.sort((a, b) => {
        if (a.content_type === 'directory' && b.content_type === 'file') {
            return -1;
        } else if (a.content_type === 'file' && b.content_type === 'directory') {
            return 1;
        } else {
            return 0;
        }
    });


    // sortProjectsByType function to sort projects by file type
    const sortProjectsByType = (projects) => {
        return projects.sort((a, b) => {
            if (a.content_type === 'directory' && b.content_type === 'file') {
                return -1; // directory comes before file
            } else if (a.content_type === 'file' && b.content_type === 'directory') {
                return 1; // file comes after directory
            } else {
                return 0; // maintain original order
            }
        });
    };



    const onSelect = (keys, info) => {
        router.push(`/?object_id=${keys}`);
        console.log('Trigger Select', keys, info);
    };


    // convert the dir to tree data
    const convertToTreeData = (responseData) => {
        // console.log("!!!!!!!!!!!!in convert");
        return sortProjectsByType(responseData).map(item => {
            const treeItem = {
                title: item.name,
                key: item.id,
                isLeaf: item.content_type !== 'directory',
                path: item.path,
                expanded: false, // initialize expanded state to false
                children: [] // eneure every node having the children element
            };
            return treeItem;
        });
    };

    // append the clicked dir to the treeData
    const appendTreeData = (treeData, subItems, clickedNodeKey) => {
        return treeData.map(item => {
            if (item.key === clickedNodeKey) {
                return {
                    ...item,
                    children: subItems
                };
            } else if (Array.isArray(item.children)) {
                return {
                    ...item,
                    children: appendTreeData(item.children, subItems, clickedNodeKey)
                };
            }
        });
    };

    const onExpand = async (keys, { expanded, node }) => {
        // push new url and query to router
        console.log("OnExpanded!");
        router.push({ query: { repo_path: "/projects/freighter", object_id: node.key } });
        var responseData = '';
        try {
            const response = await fetch(`/api/tree?repo_path=/projects/freighter&object_id=${encodeURIComponent(node.key)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch tree data');
            }

            console.log('Response status:', response.status);

            responseData = await response.json();
            console.log('Response data:', responseData);

        } catch (error) {
            console.error('Error fetching tree data:', error);
        }
        // onRenderTree(node.key);
        if (expanded) {
            const subTreeData = convertToTreeData(responseData.items);
            const newTreeData = appendTreeData(treeData, subTreeData, node.key);
            const newExpandedKeys = [];
            for (let i = 0; i < expandedKeys.length; i++) {
                newExpandedKeys.push(expandedKeys[i]);
            }
            newExpandedKeys.push(node.key);
            setExpandedKeys(newExpandedKeys);

            setTreeData(newTreeData);
            const newPath = [];
            for (let i = 0; i < currentPath.length; i++) {
                newPath.push(currentPath[i]);
            }
            newPath.push(node.title);
            setCurrentPath(newPath);
            // for breadcrumb
        } else {
            setExpandedKeys(expandedKeys.filter(key => key !== node.key));
            setCurrentPath(currentPath.slice(0, expandedKeys.length - 2));
            if (TreeData[node.key]) {
                setTreeData(TreeData[node.key].expanded == true);
            }
        }
    };


    const handleBreadcrumbClick = async (index, key) => {
        if (index === 0) {
            console.log("clicked root path");
            setShowTree(false);
            router.push(`/?repo_path=/projects/freighter`);
        } else {
            setCurrentPath(currentPath.slice(0, index + 1));
            router.push(`/?repo_path=/projects/freighter&object_id=${key}`);

            // reRender the tree for back to clicked dir
            var responseData = '';
            try {
                const response = await fetch(`/api/tree?repo_path=/projects/freighter&object_id=${encodeURIComponent(key)}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch tree data');
                }

                console.log('Response status:', response.status);

                responseData = await response.json();
                console.log('Response data:', responseData);

            } catch (error) {
                console.error('Error fetching tree data:', error);
            }

            const subTreeData = convertToTreeData(responseData.items);
            const newTreeData = appendTreeData(treeData, subTreeData, key);
            const newExpandedKeys = [];
            for (let i = 0; i < expandedKeys.length; i++) {
                newExpandedKeys.push(expandedKeys[i]);
            }
            newExpandedKeys.push(key);
            setExpandedKeys(newExpandedKeys);

            setTreeData(newTreeData);
        }

    };

    const breadCrumbItems = currentPath.map((path, index) => ({
        title: path,
        onClick: () => handleBreadcrumbClick(index, expandedKeys[index - 1]),
    }));


    const [isBlameView, setIsBlameView] = useState(false); // show type
    const [expandedLine, setExpandedLine] = useState(null);

    const handleCodeButtonClick = () => {
        setIsBlameView(false);
        setExpandedLine(null); // reset expanded line
        setShowEditor(false); // reset editor state
    };

    const handleBlameButtonClick = () => {
        setIsBlameView(true);
        setShowEditor(false); // 重置编辑器显示状态
    };


    return (
        <div>
            <TopNavbar />
            {showTree && (
                <div className='dirTreeContainer'>
                    <DirectoryTree
                        multiple
                        onSelect={onSelect}
                        onExpand={onExpand}
                        treeData={treeData}
                        showLine={true}
                        switcherIcon={<DownOutlined />}
                        expandedKeys={expandedKeys}
                    />
                </div>
            )}
            {showTree && (
                <Breadcrumb className='breadCrumb'
                    items={breadCrumbItems}
                />
            )}

            {!fileContent && (
                <div className="dirTable" style={fileCodeContainerStyle}>
                    <div className="innerTable">
                        <table className="dirShowTable">
                            <thead className="dirShowTableThead">
                                <tr>
                                    <th scope="col" className="dirShowTableTr">
                                        Name
                                    </th>
                                    <th scope="col" className="dirShowTableTr">
                                        commit
                                    </th>
                                    <th scope="col" className="dirShowTableTr">
                                        commitData
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="dirShowTableTbody">
                                {showTree && (
                                    <tr style={dirShowTrStyle} className="dirShowTr" key="back">
                                        <td className="projectName ">
                                            <img src="/icons/folder.svg" className='fileTableIcon' alt="File icon" />
                                            <span onClick={() => handleGoBack()}>..</span>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                )}

                                {sortedProjects.map((project) => (
                                    <tr style={dirShowTrStyle} className="dirShowTr" key={project.id}>
                                        {project.content_type === 'file' && (
                                            <td className="projectName ">
                                                <img src="/icons/file.svg" className='fileTableIcon' alt="File icon" />
                                                <span onClick={() => handleFileClick(project)}>{project.name}</span>
                                            </td>
                                        )}
                                        {project.content_type === 'directory' && (
                                            <td className="projectName ">
                                                <img src="/icons/folder.svg" className='fileTableIcon' alt="File icon" />
                                                <span onClick={() => handleDirectoryClick(project)}>{project.name}</span>
                                            </td>
                                        )}
                                        <td className="projectCommitMsg ">{project.commit_msg}</td>
                                        <td className="projectCommitMsg">{project.commit_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {readmeContent && (
                        <div className='markdownContent'>
                            <div className="markdown-body">
                                <Markdown>{readmeContent}</Markdown>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {fileContent && (
                <div className="fileCodeContainer">
                    <div className="viewChangeTab">
                        <button
                            className='viewChangeTabButton1'
                            onClick={handleCodeButtonClick}
                            style={{ backgroundColor: !isBlameView ? 'darkgray' : 'lightgray' }}
                        >
                            Code
                        </button>
                        <button
                            className='viewChangeTabButton'
                            onClick={handleBlameButtonClick}
                            style={{ backgroundColor: isBlameView ? 'darkgray' : 'lightgray' }}
                        >
                            Blame
                        </button>
                    </div>

                    <Highlight
                        theme={themes.github}
                        code={fileContent}
                        language="rust"
                        key={highlightKey}
                    >
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre style={style} className="codeShowContainer">
                                {tokens.map((line, i) => {
                                    const lineProps = getLineProps({ line });
                                    const isChangedLine = fileBlameContent[i + 1] && isBlameView;
                                    const isExpanded = expandedLine === i + 1; // 判断此行是否可展开也就是是否有评审内容
                                    const blameInfo = fileBlameContent[i + 1];
                                    return (
                                        <React.Fragment key={i}>
                                            <div
                                                {...lineProps}
                                                style={{
                                                    ...lineProps.style,
                                                    backgroundColor: isChangedLine ? 'rgba(138, 188, 229, 0.221)' : lineProps.style.backgroundColor,


                                                }}
                                            >
                                                <button
                                                    onClick={() => handleLineNumberClick(i + 1)}
                                                    className="lineNumberButton"
                                                    style={{
                                                        marginLeft: '8px',
                                                        backgroundColor: 'rgb(247, 237, 224, 0.7)',
                                                        width: '25px',
                                                        height: '17px',
                                                        lineHeight: '17px',
                                                        borderRadius: '3px',
                                                        marginTop: '5px',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {isBlameView ? '>' : '+'}
                                                </button>
                                                <span className="codeLineNumber">{i + 1}</span>
                                                {line.map((token, key) => (
                                                    <span key={key} {...getTokenProps({ token })} />
                                                ))}
                                            </div>
                                            {isExpanded && isBlameView && blameInfo && (
                                                <div
                                                    style={{
                                                        backgroundColor: '#ffffff',
                                                        margin: '10px auto',
                                                        padding: '10px 20px',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                        maxWidth: '80%',
                                                        overflowWrap: 'break-word',
                                                        wordWrap: 'break-word',
                                                        borderRadius: '1rem'

                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                        <img
                                                            src={`/images/${blameInfo.avatar}.png`}
                                                            alt={`${blameInfo.user} avatar`}
                                                            style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                                                        />
                                                        <div>
                                                            <strong>{blameInfo.user}</strong>
                                                            <br />
                                                            <small>{blameInfo.time}</small>
                                                        </div>
                                                    </div>
                                                    <Markdown style={{ overflowWrap: 'break-word' }}>
                                                        {blameInfo.content || "No comment provided"}
                                                    </Markdown>
                                                </div>
                                            )
                                            }
                                        </React.Fragment>
                                    );
                                })}
                            </pre>
                        )}
                    </Highlight>
                </div>
            )
            }
            <Bottombar />
        </div >

    );
};

export async function getServerSideProps(context) {
    const MEGA_URL = 'http://localhost:8000';
    // get the parameters form context
    const { repo_path, object_id } = context.query;
    const rootDirectory = (await axios.get(`${MEGA_URL}/api/v1/tree?repo_path=/projects/freighter`)).data;

    // obtain the current directory, the root directory only has the 'path' parameter without the 'id' parameter. Both parameters exist for non-root directories
    const response = repo_path && object_id
        ? await axios.get(`${MEGA_URL}/api/v1/tree?repo_path=/projects/freighter&object_id=${encodeURIComponent(object_id)}`)
        : await axios.get(`${MEGA_URL}/api/v1/tree?repo_path=/projects/freighter`);

    const directory = response.data;
    var readmeContent = '';
    var fileContent = '';
    var TreeData = '';

    // get the file content
    if (object_id) {
        try {
            const fileResponse = await axios.get(`${MEGA_URL}/api/v1/blob?object_id=${object_id}`, { withCredentials: true });
            fileContent = fileResponse.data.row_data;
        } catch (error) {
            console.error("Error fetching file content:", error);
        }
    }

    // get the readme file content
    for (const project of directory.items || []) {
        if (project.name === 'README.md' && project.content_type === 'file') {
            try {
                const response = await axios.get(`${MEGA_URL}/api/v1/blob?object_id=${project.id}`, { withCredentials: true });
                readmeContent = response.data.row_data;
                break;
            } catch (error) {
                console.error("Error fetching README content:", error);
            }

        }
    }



    return {
        props: {
            rootDirectory,
            directory,
            readmeContent,
            fileContent,
            TreeData,
        },
    };
}


export default HomePage;