import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';


function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/blogs';

   const fetchTasks = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
       setBlogs(response.data)
       console.log(response.data); 
       setLoading(false);
    } catch (error) {
      //throw error;
      setError('Error fetching blog details');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks()
      
  }, []);
  
  
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/create-blog', {
        title: newBlogTitle,
        content: newBlogContent,
        
      });
      console.log(response.data.message);
      
      setNewBlogTitle('');
      setNewBlogContent('');
     
      
    } catch (error) {
      console.error('Blog creation failed:', error);
    }
  };

  return (
    <div>
      <Container>
        <Row className="mt-5">
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            blogs.map((blog) => (
              <Col key={blog._id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Text>{blog.content.substring(0, 100)}...</Card.Text>
                    <Button variant="primary">Read More</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
        <Row className="justify-content-center mt-3">
          <Col>
            <Button variant="primary" onClick={handleNextPage}>
              Next Page
            </Button>
          </Col>
        </Row>
      </Container>
      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <h2>Create a New Blog</h2>
            <Form>
              <Form.Group controlId="newBlogTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="newBlogContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter content"
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" onClick={handleCreateBlog}>
                Create Blog
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BlogList;
