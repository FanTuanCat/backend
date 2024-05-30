import { CodeHighlightNode, CodeNode, registerCodeHighlighting } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { useEffect, useCallback } from "react";
import "../../styles/editor.css";
import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./ToolbarPlugin";
import React, { useState } from 'react';

function Placeholder() {
    return <div className="editor-placeholder">Writing your comment...</div>;
}

function CodeHighlightPlugin() {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return registerCodeHighlighting(editor);
    }, [editor]);
    return null;
}

const editorConfig = {
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
        throw error;
    },
    // Any custom nodes go here
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
    ],
};


export default function Editor({ lineIndex, fileBlameContent, setFileBlameContent, onCloseEditor }) {
    const [comment, setComment] = useState('');
    const [showConfirmButton, setShowConfirmButton] = useState(false);

    const handleConfirmClick = () => {
        const commentId = Math.random().toString(36).substring(2, 10);


        const date = new Date();

        const beijingTimeOffset = 8 * 60;

        const beijingTime = new Date(date.getTime() + (beijingTimeOffset * 60 * 1000));

        const year = beijingTime.getUTCFullYear();
        const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0'); // 月份是从0开始的
        const day = String(beijingTime.getUTCDate()).padStart(2, '0');
        const hours = String(beijingTime.getUTCHours()).padStart(2, '0');
        const minutes = String(beijingTime.getUTCMinutes()).padStart(2, '0');
        const seconds = String(beijingTime.getUTCSeconds()).padStart(2, '0');


        const formattedBeijingTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const userName = 'YutingNie';

        setFileBlameContent({
            ...fileBlameContent,
            [lineIndex]: {
                user: userName,
                userId: commentId,
                avatar: 'YutingNie',
                time: formattedBeijingTime,
                content: 'good'
            }
        });

        setComment('');
        setShowConfirmButton(false);
        onCloseEditor();
        console.log(fileBlameContent);
    };

    const handleQuitClick = () => {

        setComment('');
        setShowConfirmButton(false);
        onCloseEditor();

    };

    const onChange = useCallback((editorState) => {
        editorState.read(() => {
            const htmlString = editorState.toJSON();
            setComment(htmlString);
            setShowConfirmButton(!!htmlString.trim());
        });
    }, []);
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container">
                <ToolbarPlugin />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<Placeholder />}
                        onChange={onChange}
                    />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <CodeHighlightPlugin />
                </div>
                <button onClick={handleConfirmClick} className="handleConfirmClickButton">确定</button>
                <button onClick={handleQuitClick} className="handleQuitClickButton">取消</button>

            </div>
        </LexicalComposer>
    );
}
