import { useState } from 'react';
import { Card, Form, Input, Select, Button, List, Tag, Divider, Spin, Row, Col, Space, message } from 'antd';
import { BulbOutlined, BookOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons';
// 1. Remove Axios, import Google Generative AI
import { GoogleGenerativeAI } from "@google/generative-ai";

const { TextArea } = Input;
const { Option } = Select;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function BookRecommendationPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

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

        const prompt = `As a book recommendation expert, suggest 5 books based on the following preferences:

        **User Preferences**: ${preferences || 'No specific preferences'}
        **Favorite Genres**: ${selectedGenres?.join(', ') || 'Any genre'}
        **Current Mood**: ${mood || 'Open to anything'}
        **Previously Enjoyed Books**: ${previousBooks || 'None mentioned'}

        For each book, provide:
        1. Title
        2. Author
        3. Brief description (2-3 sentences)
        4. Why it matches the user's preferences

        Format your response as a JSON array with keys: "title", "author", "description", "reason".`;

        try {
            // 2. Initialize SDK
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

            // 3. Configure model to enforce JSON output
            // This significantly reduces parsing errors
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // 4. Parse the result
            // Since we requested JSON mime type, we can usually parse directly,
            // but we still clean markdown code blocks just in case.
            const cleanedText = text.replace(/```json|```/g, '').trim();
            const parsedRecommendations = JSON.parse(cleanedText);

            setRecommendations(parsedRecommendations);

        } catch (err) {
            console.error('Gemini API Error:', err);

            setRecommendations([{
                title: 'Error Getting Recommendations',
                author: 'System',
                description: 'Failed to fetch recommendations from AI.',
                reason: err.message
            }]);
            message.error("Failed to generate recommendations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <Card
                title={
                    <span>
                        <BulbOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        AI-Powered Book Recommendations
                    </span>
                }
                bordered={false}
            >
                <p style={{ color: '#666', marginBottom: '24px' }}>
                    Tell us what you like, and let our AI recommend the perfect books for you! 📚
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
                                label="What kind of books do you enjoy?"
                                tooltip="E.g., 'I love fast-paced thrillers with unexpected twists'"
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Describe your reading preferences..."
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="previousBooks"
                                label="Books you've loved recently"
                                tooltip="This helps us understand your taste better"
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="E.g., '1984 by George Orwell, The Alchemist by Paulo Coelho'"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="genres"
                                label="Favorite Genres"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select genres you enjoy"
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
                                label="Current Reading Mood"
                            >
                                <Select placeholder="How do you feel today?">
                                    <Option value="adventurous">Adventurous 🗺️</Option>
                                    <Option value="thoughtful">Thoughtful 🤔</Option>
                                    <Option value="escapist">Need an Escape 🌟</Option>
                                    <Option value="motivated">Looking for Motivation 💪</Option>
                                    <Option value="relaxed">Want to Relax 😌</Option>
                                    <Option value="curious">Curious to Learn 📖</Option>
                                    <Option value="emotional">In the Mood for Feelings ❤️</Option>
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
                            Get AI Recommendations
                        </Button>
                    </Form.Item>
                </Form>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                        <p style={{ marginTop: '16px', color: '#888' }}>
                            🤖 AI is analyzing your preferences...
                        </p>
                    </div>
                )}

                {!loading && recommendations.length > 0 && (
                    <>
                        <Divider orientation="left">
                            <BookOutlined /> Your Personalized Recommendations
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
                                            color: '#1890ff',
                                            fontWeight: 'bold',
                                            opacity: 0.2
                                        }}>
                                            #{index + 1}
                                        </div>
                                    }
                                >
                                    <List.Item.Meta
                                        avatar={<BookOutlined style={{ fontSize: '32px', color: '#1890ff' }} />}
                                        title={
                                            <Space>
                                                <span style={{ fontSize: '18px', fontWeight: 600 }}>
                                                    {book.title}
                                                </span>
                                                {index === 0 && <Tag color="gold">Top Pick!</Tag>}
                                            </Space>
                                        }
                                        description={
                                            <div>
                                                <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                                    by <strong>{book.author}</strong>
                                                </p>
                                            </div>
                                        }
                                    />

                                    <div style={{ marginTop: '12px' }}>
                                        <p style={{ marginBottom: '8px' }}>
                                            <strong>About:</strong> {book.description}
                                        </p>
                                        <p style={{
                                            padding: '12px',
                                            background: '#f6f8fa',
                                            borderRadius: '8px',
                                            borderLeft: '4px solid #1890ff'
                                        }}>
                                            <HeartOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                                            <strong>Why you'll love it:</strong> {book.reason}
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
                                💡 Want different suggestions? Adjust your preferences and try again!
                            </p>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}