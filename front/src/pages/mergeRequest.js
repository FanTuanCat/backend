import { SearchOutlined } from '@ant-design/icons/lib';
import { Button, Input, Space, Table, Tag } from 'antd/lib';
import Link from 'next/link';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import Bottombar from '../components/Bottombar';
import TopNavbar from '../components/TopNavbar';
import '../styles/index.css';
import "../styles/mergeRequest.css";
import { Highlight, themes } from "prism-react-renderer";

const MergeRequest = () => {
    const MRButtonStyle = { backgroundColor: '#1aaba8', color: 'white' };
    const MRTableStyle = { boxShadow: '1px -1px 10px rgba(108, 108, 108, 0.224)' };
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [sortedInfo, setSortedInfo] = useState({});
    const handleChange = (pagination, filters, sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };
    const clearFilters = () => {
        setFilteredInfo({});
    };
    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };
    const setAgeSort = () => {
        setSortedInfo({
            order: 'descend',
            columnKey: 'mergeTime',
        });
    };


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        type='link'
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const getColorForTag = (tag) => {
        switch (tag.toLowerCase()) {
            case 'documentation':
                return 'blue';
            case 'bug':
                return 'red';
            case 'good first issue':
                return 'green';
            case 'refactoring':
                return 'orange';
            case 'new feature':
                return 'cyan';
            case 'dependencies':
                return 'purple';
            case 'rust':
                return 'gold';
            case 'help wanted':
                return 'volcano';
            case 'website':
                return 'lime';
            case 'community':
                return 'magenta';
            case 'netpoll':
                return 'geekblue';
            case 'volo':
                return 'cyan';
            case 'javascript':
                return 'gold';
            default:
                return 'geekblue'; // Default color for other tags
        }
    };


    const columns = [
        {
            title: 'Status',
            dataIndex: 'mergeStatus',
            key: 'mergeStatus',
            filters: [
                { text: 'Open', value: 'open' },
                { text: 'Closed', value: 'closed' },
            ],
            filteredValue: filteredInfo.mergeStatus || null,
            onFilter: (value, record) => record.mergeStatus === value,
            render: (text) => (
                <img className='mergeStatusIcon' src={text === 'open' ? "/icons/git-pull-request-green.svg" : "/icons/merge.svg"}></img>
            ),
            ellipsis: true,
            width: 90,
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            ellipsis: true,
            ...getColumnSearchProps('author'),
            render: (text, record) => (
                <Link href={{ pathname: '/mergeRequestDetail', query: { userId: record.userId } }}>
                    <span>{text}</span>
                </Link>
            ),
            width: 120,
        },
        {
            title: 'Time',
            dataIndex: 'mergeTime',
            key: 'mergeTime',
            sorter: (a, b) => a.mergeTime - b.mergeTime,
            sortOrder: sortedInfo.columnKey === 'mergeTime' ? sortedInfo.order : null,
            ellipsis: true,
            width: 90,
        },
        {
            title: 'Merge Title',
            dataIndex: 'mergeTitle',
            key: 'mergeTitle',
            ellipsis: true,
            ...getColumnSearchProps('mergeTitle'), // Add search functionality for the 'mergeTitle' column
            render: (text, record) => (

                <Link href={{ pathname: '/mergeRequestDetail', query: { userId: record.userId } }}>
                    <span>{text}</span>
                </Link>
            ),
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            filters: [
                { text: 'documentation', value: 'documentation' },
                { text: 'bug', value: 'bug' },
                { text: 'good first issue', value: 'good first issue' },
                { text: 'refactoring', value: 'refactoring' },
                { text: 'new feature', value: 'new feature' },
                { text: 'dependencies', value: 'dependencies' },
                { text: 'rust', value: 'rust' },
            ],
            filteredValue: filteredInfo.tags || null,
            onFilter: (value, record) => record.tags.includes(value),
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        const color = getColorForTag(tag);
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
    ];


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

    function generateRandomUserId() {
        return Math.random().toString(36).substring(2, 10);
    }

    return (
        <div>
            <div>
                <TopNavbar />
                <div className='mergeRequestTable'>
                    <Space
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        <Button style={MRButtonStyle} onClick={setAgeSort}>Lables</Button>
                        <Button style={MRButtonStyle} onClick={setAgeSort}>Sort merge time</Button>
                        <Button onClick={clearFilters}>Clear filters</Button>
                        <Button onClick={clearAll}>Clear filters and sorters</Button>
                    </Space>
                    <Table style={MRTableStyle} columns={columns} dataSource={data} onChange={handleChange} />
                </div>
                <Bottombar />
            </div>
        </div>
    );
};

export default MergeRequest;