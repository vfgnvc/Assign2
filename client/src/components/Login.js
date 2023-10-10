import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // const axiosInstance = axios.create({
  //   baseURL: 'http://localhost:3001', 
  // });

  // const handleLogin = async () => {
  //   try {
  //     const response = await axiosInstance.post('/login', { username, password });
  //     console.log(response.data.message);
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //   }
  // };

   const handleLogin = (e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/login',{username,password})
    .then(result=>{
      console.log(result);
      if(result.data==='Sucess'){
        navigate('/')
        
      }
    })
    .catch(err=>console.log(err))
   }



  return (
    <Container>
    <Row className="justify-content-center mt-5">
      <Col md={6}>
        <h2 className="mb-4">Login</h2>
        <Form>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Form>
        <p className="mt-3">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </Col>
    </Row>
  </Container>
  )
}

export default Login