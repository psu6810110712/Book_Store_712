import { useState, useEffect } from 'react';
import { Modal, Button, Spin, Card, Typography, message, Space, Tag } from 'antd';
import { BulbOutlined, RobotOutlined, BookOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLanguage } from '../contexts/LanguageContext';

const { Paragraph, Title, Text } = Typography;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function GeminiBookDetails({ book, isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const [bookInfo, setBookInfo] = useState(null);
    const { language, t } = useLanguage();

    const fetchBookDetails = async () => {
        if (!book) return;

        if (!GEMINI_API_KEY) {
            message.warning('Please set VITE_GEMINI_API_KEY in your .env file');
            return;
        }

        setLoading(true);
        setBookInfo(null);

        // Dynamic prompt based on language
        const promptLang = language === 'th' ? 'ภาษาไทย' : 'English';
        const prompt = `Analyze the book "${book.title}" by ${book.author}

Respond in JSON format (in ${promptLang}, keep it concise):
{
    "summary": "1-2 sentence plot summary",
    "genre": "Book genre/category",
    "rating": "Rating 1-5",
    "keyPoints": ["Highlight 1", "Highlight 2", "Highlight 3"],
    "recommend": "Who should read this (1 sentence)"
}`;

        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const cleanedText = text.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanedText);
            setBookInfo(parsed);

        } catch (err) {
            console.error('Gemini API Error:', err);

            let errorMessage = language === 'th' ? 'เกิดข้อผิดพลาด' : 'An error occurred';
            if (err.message.includes('429')) {
                errorMessage = language === 'th' ? '⏳ คำขอมากเกินไป กรุณารอสักครู่' : '⏳ Too many requests. Please wait.';
            }
            if (err.message.includes('404')) {
                errorMessage = language === 'th' ? '❌ Model ไม่พร้อมใช้งาน' : '❌ Model not available';
            }

            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && book && !bookInfo) {
            fetchBookDetails();
        }
    }, [isOpen, book]);

    useEffect(() => {
        if (!isOpen) {
            setBookInfo(null);
        }
    }, [isOpen]);

    const renderStars = (rating) => {
        const stars = parseInt(rating) || 4;
        return '⭐'.repeat(Math.min(stars, 5));
    };

    return (
        <Modal
            title={
                <Space>
                    <RobotOutlined style={{ color: '#1890ff' }} />
                    <span>{t('aiInsights')}</span>
                </Space>
            }
            open={isOpen}
            onCancel={onClose}
            width={500}
            footer={[
                <Button key="refresh" onClick={fetchBookDetails} loading={loading} icon={<BulbOutlined />}>
                    {t('regenerate')}
                </Button>,
                <Button key="close" type="primary" onClick={onClose}>
                    {t('close')}
                </Button>,
            ]}
        >
            {book && (
                <>
                    {/* Book Header */}
                    <Card size="small" style={{ marginBottom: 16, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <Title level={5} style={{ margin: 0, color: '#fff' }}>
                            📚 {book.title}
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.85)' }}>by {book.author}</Text>
                    </Card>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <Spin size="large" />
                            <p style={{ marginTop: 16, color: '#888' }}>🤖 {t('aiAnalyzing')}</p>
                        </div>
                    ) : bookInfo ? (
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">

                            {/* Genre & Rating */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Tag color="blue" icon={<BookOutlined />}>{bookInfo.genre || 'General'}</Tag>
                                <span style={{ fontSize: 16 }}>{renderStars(bookInfo.rating)}</span>
                            </div>

                            {/* Summary */}
                            <Card size="small" style={{ background: '#f6f8fa' }}>
                                <Text strong><BulbOutlined /> {t('summary')}</Text>
                                <Paragraph style={{ margin: '8px 0 0 0', color: '#555' }}>
                                    {bookInfo.summary || 'No data available'}
                                </Paragraph>
                            </Card>

                            {/* Key Points */}
                            {bookInfo.keyPoints && bookInfo.keyPoints.length > 0 && (
                                <Card size="small" style={{ background: '#f0f5ff' }}>
                                    <Text strong><StarOutlined /> {t('keyPoints')}</Text>
                                    <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                                        {bookInfo.keyPoints.map((point, i) => (
                                            <li key={i} style={{ color: '#555', marginBottom: 4 }}>{point}</li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {/* Recommendation */}
                            <Card size="small" style={{ background: '#fff7e6', borderLeft: '3px solid #fa8c16' }}>
                                <Text strong><HeartOutlined style={{ color: '#fa8c16' }} /> {t('recommendFor')}</Text>
                                <Paragraph style={{ margin: '8px 0 0 0', color: '#555' }}>
                                    {bookInfo.recommend || 'Anyone who loves reading'}
                                </Paragraph>
                            </Card>
                        </Space>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
                            <BulbOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                            <p>{language === 'th' ? 'คลิก "วิเคราะห์ใหม่" เพื่อดูข้อมูล' : 'Click "Regenerate" to get insights'}</p>
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
}