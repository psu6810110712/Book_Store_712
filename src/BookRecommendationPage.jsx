import { useState } from 'react';
import { Card, Form, Input, Select, Button, List, Tag, Divider, Spin, Row, Col, Space, message } from 'antd';
import { BulbOutlined, BookOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLanguage } from './contexts/LanguageContext';

const { TextArea } = Input;
const { Option } = Select;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function BookRecommendationPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const { t } = useLanguage();

    const genres = [
        'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller',
        'Romance', 'Horror', 'Biography', 'History', 'Science', 'Self-Help',
        'Business', 'Philosophy', 'Poetry', 'Drama', 'Adventure', 'Crime'
    ];

    const handleRecommend = async (values) => {
        if (!GEMINI_API_KEY) {
            setRecommendations([{
                title: '⚠️ API Key Required',
                author: 'System',
                description: 'Please set your Gemini API key in your .env file to use this feature.',
                reason: 'Get your key from https://aistudio.google.com/'
            }]);
            return;
        }

        setLoading(true);
        setRecommendations([]);

        const { preferences, genres: selectedGenres, mood, previousBooks } = values;

        // Prompt is in English to ensure clear AI understanding, output is requested in JSON.
        // If we want Thai output, we should prompt "Answer in Thai".
        // Let's check language.
        const langPrompt = localStorage.getItem('app-language') === 'th' ? "Answer in Thai language." : "Answer in English language.";

        const prompt = `As a book recommendation expert, suggest 5 books based on the following preferences:

        **User Preferences**: ${preferences || 'No specific preferences'}
        **Favorite Genres**: ${selectedGenres?.join(', ') || 'Any genre'}
        **Current Mood**: ${mood || 'Open to anything'}
        **Previously Enjoyed Books**: ${previousBooks || 'None mentioned'}

        ${langPrompt}

        For each book, provide:
        1. Title
        2. Author
        3. Brief description (2-3 sentences)
        4. Why it matches the user's preferences

        Format your response as a JSON array with keys: "title", "author", "description", "reason".`;

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
            const parsedRecommendations = JSON.parse(cleanedText);

            setRecommendations(parsedRecommendations);

        } catch (err) {
            console.error('Gemini API Error:', err);

            setRecommendations([{
                title: t('error'),
                author: 'System',
                description: 'Failed to fetch recommendations from AI.',
                reason: err.message
            }]);
            message.error(t('error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Card
                title={
                    <span>
                        <BulbOutlined style={{ marginRight: '8px', color: '#33bcb7' }} />
                        {t('aiTitle')}
                    </span>
                }
                bordered={false}
            >
                <p style={{ color: '#666', marginBottom: '24px' }}>
                    {t('aiDescription')}
                </p>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleRecommend}
                >
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="preferences"
                                label={t('preferences')}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder={t('preferences')}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="previousBooks"
                                label={t('previousBooks')}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder={t('previousBooks')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="genres"
                                label={t('favoriteGenres')}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder={t('favoriteGenres')}
                                    maxTagCount={3}
                                >
                                    {genres.map(genre => (
                                        <Option key={genre} value={genre}>{genre}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="mood"
                                label={t('currentMood')}
                            >
                                <Select placeholder={t('currentMood')}>
                                    <Option value="adventurous">{t('moodAdventurous')}</Option>
                                    <Option value="thoughtful">{t('moodThoughtful')}</Option>
                                    <Option value="escapist">{t('moodEscapist')}</Option>
                                    <Option value="motivated">{t('moodMotivated')}</Option>
                                    <Option value="relaxed">{t('moodRelaxed')}</Option>
                                    <Option value="curious">{t('moodCurious')}</Option>
                                    <Option value="emotional">{t('moodEmotional')}</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<StarOutlined />}
                            size="large"
                            loading={loading}
                        >
                            {t('getRecommendations')}
                        </Button>
                    </Form.Item>
                </Form>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: '16px', color: '#888' }}>
                            🤖 {t('analyzingPreferences')}
                        </p>
                    </div>
                )}

                {!loading && recommendations.length > 0 && (
                    <>
                        <Divider orientation="left">
                            <BookOutlined /> {t('yourRecommendations')}
                        </Divider>

                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={recommendations}
                            renderItem={(book, index) => (
                                <List.Item
                                    key={index}
                                    extra={
                                        <div style={{
                                            fontSize: '48px',
                                            color: '#33bcb7',
                                            fontWeight: 'bold',
                                            opacity: 0.2
                                        }}>
                                            #{index + 1}
                                        </div>
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={<BookOutlined style={{ fontSize: '32px', color: '#33bcb7' }} />}
                                        title={
                                            <Space>
                                                <span style={{ fontSize: '18px', fontWeight: 600 }}>
                                                    {book.title}
                                                </span>
                                                {index === 0 && <Tag color="gold">{t('topPick')}</Tag>}
                                            </Space>
                                        }
                                        description={
                                            <div>
                                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                                    {t('author')}: <strong>{book.author}</strong>
                                                </p>
                                            </div>
                                        }
                                    />

                                    <div style={{ marginTop: '12px' }}>
                                        <p style={{ marginBottom: '8px' }}>
                                            <strong>{t('about')}:</strong> {book.description}
                                        </p>
                                        <p style={{
                                            padding: '12px',
                                            background: '#f6f8fa',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #33bcb7'
                                        }}>
                                            <HeartOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                                            <strong>{t('whyLoveIt')}:</strong> {book.reason}
                                        </p>
                                    </div>
                                </List.Item>
                            )}
                        />

                        <div style={{
                            textAlign: 'center',
                            marginTop: '24px',
                            padding: '16px',
                            background: '#f0f2f5',
                            borderRadius: '8px'
                        }}>
                            <p style={{ margin: 0, color: '#666' }}>
                                {t('suggestionHint')}
                            </p>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}