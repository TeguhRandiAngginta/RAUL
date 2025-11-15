// client/src/pages/VerifyEmail.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Card, Row, Col, Image } from 'react-bootstrap';
import api from '../api/api';
import logo from '../assets/logo/logoWeb.png';
import img from '../assets/logo/log1.png';
import '../styles/style.css'; // Pastikan style.css di-import

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Sedang memverifikasi email Anda...');
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token verifikasi tidak ditemukan. Link tidak valid.');
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await api.post('/auth/verify-email', { token });
                setStatus('success');
                setMessage(res.data.message || 'Email berhasil diverifikasi! Anda akan diarahkan ke halaman login.');
                
                setTimeout(() => {
                    navigate('/signin');
                }, 3000);

            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Gagal memverifikasi email. Token mungkin kedaluwarsa atau tidak valid.');
            }
        };

        verifyToken();
        
    }, [token, navigate]);

    // Fungsi untuk menampilkan konten berdasarkan status
    const renderStatus = () => {
        if (status === 'verifying') {
            return (
                <>
                    <h2 className="mb-4 archivo title-form align-title">Verifikasi Akun</h2>
                    <Spinner animation="border" variant="warning" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
                    <h5 className="text-dark">{message}</h5>
                    <p className="text-muted">Harap tunggu sebentar...</p>
                </>
            );
        }
        if (status === 'success') {
            return (
                <Alert variant="success" className="w-100">
                    <Alert.Heading>Verifikasi Berhasil!</Alert.Heading>
                    <p>{message}</p>
                    <hr />
                    <Button as={Link} to="/signin" variant="success">
                        Login Sekarang
                    </Button>
                </Alert>
            );
        }
        if (status === 'error') {
            return (
                <Alert variant="danger" className="w-100">
                    <Alert.Heading>Verifikasi Gagal!</Alert.Heading>
                    <p>{message}</p>
                    <hr />
                    <Button as={Link} to="/signup" variant="danger">
                        Coba Daftar Lagi
                    </Button>
                </Alert>
            );
        }
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center signup-container"
        >
            <Card className="p-5 w-75 card">
                <Row>
                    {/* Left Side (Sama seperti Signin) */}
                    <Col md={6} className="text-center left-side">
                        <div className="d-flex justify-content-center align-items-center mb-3 mt-3">
                            <Image src={logo} roundedCircle className="logo me-2 mb-2" />
                            <h2 className="mb-1 archivo title-logo title-form align-title">RAUL</h2>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Image src={img} rounded className="log1" />
                        </div>
                    </Col>

                    {/* Right Side (Menampilkan Status Verifikasi) */}
                    <Col md={6} className="right-side d-flex flex-column justify-content-center align-items-center text-center">
                        {renderStatus()}
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default VerifyEmail;