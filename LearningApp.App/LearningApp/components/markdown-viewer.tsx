import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface MarkdownViewerProps {
  content: string;
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const markdownStyles = StyleSheet.create({
    body: {
      color: isDark ? '#fff' : '#000',
      fontSize: 14,
      lineHeight: 22,
    },
    heading1: {
      color: isDark ? '#fff' : '#000',
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    heading2: {
      color: isDark ? '#fff' : '#000',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 8,
      marginBottom: 8,
    },
    heading3: {
      color: isDark ? '#fff' : '#000',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 6,
      marginBottom: 6,
    },
    heading4: {
      color: isDark ? '#fff' : '#000',
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 4,
      marginBottom: 4,
    },
    heading5: {
      color: isDark ? '#fff' : '#000',
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 4,
      marginBottom: 4,
    },
    heading6: {
      color: isDark ? '#fff' : '#000',
      fontSize: 12,
      fontWeight: 'bold',
      marginTop: 4,
      marginBottom: 4,
    },
    paragraph: {
      color: isDark ? '#fff' : '#000',
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
    },
    strong: {
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    em: {
      fontStyle: 'italic',
      color: isDark ? '#fff' : '#000',
    },
    code_inline: {
      backgroundColor: isDark ? '#444' : '#f5f5f5',
      color: isDark ? '#4EC9B0' : '#c7254e',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 3,
      fontFamily: 'monospace',
      fontSize: 13,
    },
    code_block: {
      backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
      color: isDark ? '#d4d4d4' : '#333',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      fontFamily: 'monospace',
      fontSize: 13,
    },
    fence: {
      backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5',
      color: isDark ? '#d4d4d4' : '#333',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      fontFamily: 'monospace',
      fontSize: 13,
    },
    blockquote: {
      backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9',
      borderLeftColor: isDark ? '#007AFF' : '#007AFF',
      borderLeftWidth: 4,
      paddingLeft: 10,
      paddingVertical: 5,
      marginVertical: 10,
    },
    bullet_list: {
      marginBottom: 10,
    },
    ordered_list: {
      marginBottom: 10,
    },
    list_item: {
      color: isDark ? '#fff' : '#000',
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 5,
    },
    hr: {
      backgroundColor: isDark ? '#444' : '#ddd',
      height: 1,
      marginVertical: 10,
    },
    link: {
      color: '#007AFF',
      textDecorationLine: 'underline',
    },
    table: {
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#ddd',
      borderRadius: 5,
      marginVertical: 10,
    },
    th: {
      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
      padding: 8,
      borderBottomWidth: 1,
      borderColor: isDark ? '#444' : '#ddd',
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    td: {
      padding: 8,
      borderBottomWidth: 1,
      borderColor: isDark ? '#444' : '#ddd',
      color: isDark ? '#fff' : '#000',
    },
  });

  return (
    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </ScrollView>
  );
}
