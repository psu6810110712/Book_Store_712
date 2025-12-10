import { useState, useEffect } from 'react';
import { Modal, Button, Spin, Card, Typography, Divider, message } from 'antd';
import { BulbOutlined, RobotOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Paragraph, Title, Text } = Typography;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default function GeminiBookDetails({ book, isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');

    const fetchBookDetails = async () => {
        if (!book) return;

        // Check if API key is set
        if (!GEMINI_API_KEY) {
            message.warning('Please set VITE_GEMINI_API_KEY in your .env file');
            setAiResponse('⚠️ Gemini API key not configured.\n\nTo use this feature:\n1. Create a .env file in project root\n2. Add: VITE_GEMINI_API_KEY=your_api_key_here\n3. Get your API key from https://makersuite.google.com/app/apikey\n4. Restart dev server (npm run dev)\n5. Refresh and try again!');
            return;
        }

        setLoading(true);
        setAiResponse('');

        const prompt = `Give me a detailed summary about the book "${book.title}" by ${book.author}. Include:
1. Brief overview of the plot or main themes
2. Key characters (if applicable)
3. Why this book is important or popular
4. Similar books or authors
5. Fun facts or trivia

Keep it concise but informative (around 200-300 words).`;

        try {
            const response = await axios.post(
                `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                'No response generated.';
            setAiResponse(generatedText);
        } catch (err) {
            console.error('Gemini API Error:', err);

            let errorMessage = 'Failed to fetch book details from Gemini AI.';

            if (err.response?.status === 400) {
                errorMessage = '❌ Invalid API request. Please check your API key.';
            } else if (err.response?.status === 403) {
                errorMessage = '❌ API key is invalid or doesn\'t have permission.';
            } else if (err.response?.status === 429) {
                errorMessage = '❌ Rate limit exceeded. Please try again later.';
            } else if (err.response?.status === 404) {
                errorMessage = '❌ Model not found. Using deprecated model name.';
            }

            setAiResponse(errorMessage + '\n\nError details: ' + (err.response?.data?.error?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch when modal opens
    useEffect(() => {
        if (isOpen && book && !aiResponse) {
            fetchBookDetails();
        }
    }, [isOpen, book]);

    return (
        <Modal
            title={
                <span>
                    <RobotOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    AI-Powered Book Insights
                </span>
            }
            open={isOpen}
            onCancel={onClose}
            width={700}
            footer={[
                <Button key="refresh" onClick={fetchBookDetails} loading={loading} icon={<BulbOutlined />}>
                    Regenerate
                </Button>,
                <Button key="close" type="primary" onClick={onClose}>
                    Close
                </Button>,
            ]}
        >
            {book && (
                <>
                    <Card
                        size="small"
                        style={{ marginBottom: '16px', background: '#f6f8fa' }}
                    >
                        <Title level={5} style={{ margin: 0 }}>
                            {book.title}
                        </Title>
                        <Text type="secondary">by {book.author}</Text>
                        {book.isbn && (
                            <>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    ISBN: {book.isbn}
                                </Text>
                            </>
                        )}
                    </Card>

                    <Divider orientation="left">
                        <RobotOutlined /> Gemini AI Analysis
                    </Divider>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" />
                            <p style={{ marginTop: '16px', color: '#888' }}>
                                Asking Gemini AI about this book...
                            </p>
                        </div>
                    ) : (
                        <Card bordered={false} style={{ background: '#fafafa' }}>
                            <Paragraph style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
                                {aiResponse || 'Click "Ask AI" to get insights about this book.'}
                            </Paragraph>
                        </Card>
                    )}

                    {!loading && !aiResponse && (
                        <Button
                            type="dashed"
                            block
                            onClick={fetchBookDetails}
                            icon={<BulbOutlined />}
                            style={{ marginTop: '16px' }}
                        >
                            Ask AI About This Book
                        </Button>
                    )}
                </>
            )}
        </Modal>
    );
}
