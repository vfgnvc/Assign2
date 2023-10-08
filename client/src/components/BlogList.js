import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001', 
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get(`/blogs?page=${currentPage}`);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
  
   
    fetchBlogs(); 
  
  }, [currentPage]);
  



  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleCreateBlog = async () => {
    try {
      const response = await axios.post('/create-blog', {
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
          {blogs.map((blog) => (
            <Col key={blog._id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>{blog.content.substring(0, 100)}...</Card.Text>
                  <Button variant="primary">Read More</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="justify-content-center mt-3">
          <Col>
            <Button variant="primary" onClick={handleNextPage}>
              Next Page
            </Button>
          </Col>
        </Row>
        <Row className="mt-5">
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
