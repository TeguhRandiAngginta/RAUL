import React from 'react';
import toast from 'react-hot-toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import logo from '../assets/logo/logoWeb.png';
import img from '../assets/logo/log1.png';
import { useForm } from 'react-hook-form';
import { API_BASE_URL } from '../util.js';
import './style.css'; // Import external CSS

export default function Signup() {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm();

    const doSubmit = async values => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            console.log(values);
            const data = await res.json();
            if (res.status === 200) {
                toast.success('Sign Up Successful. You are now logged in');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center signup-container"
        >
            <Card className="p-5 w-75 card">
                <Row>
                    {/* Left Side */}
                    <Col md={6} className="text-center left-side">
                        <div className="d-flex justify-content-center align-items-center mb-3 mt-3">
                            <Image src={logo} roundedCircle className="logo me-2 mb-2" />
                            <h2 className="mb-1 archivo title-logo title-form align-title">Not Books</h2>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Image src={img} rounded className="log1" />
                        </div>
                    </Col>

                    {/* Right Side */}
                    <Col md={6} className="right-side">
                        <Form onSubmit={handleSubmit(doSubmit)} className="text-center">
                            <h2 className="mb-4 archivo title-form align-title">Daftar Akun 404</h2>

                            {/* Email Field */}
                            <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                                <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register('email', { required: 'Masukkan email' })}
                                />
                                {errors.email && (
                                    <Form.Text className="text-danger">{errors.email.message}</Form.Text>
                                )}
                            </FloatingLabel>

                            {/* Username Field */}
                            <FloatingLabel controlId="floatingInput" label="Nama Lengkap" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Alexandro Dronolo"
                                    {...register('username', { required: 'Masukkan Nama Lengkap' })}
                                />
                                {errors.username && (
                                    <Form.Text className="text-danger">{errors.username.message}</Form.Text>
                                )}
                            </FloatingLabel>

                            {/* Password Field */}
                            <FloatingLabel controlId="floatingPassword" label="Kata Sandi">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    className="mb-3"
                                    {...register('password', { required: 'Masukkan Kata Sandi' })}
                                />
                                {errors.password && (
                                    <Form.Text className="text-danger">{errors.password.message}</Form.Text>
                                )}
                            </FloatingLabel>

                            {/* Confirm Password Field */}
                            <FloatingLabel controlId="floatingConfirmPassword" label="Ulangi Kata Sandi">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    className="mb-3"
                                    {...register('confirmPassword', { required: 'Masukkan konfirmasi kata sandi' })}
                                />
                                {errors.confirmPassword && (
                                    <Form.Text className="text-danger">
                                        {errors.confirmPassword.message}
                                    </Form.Text>
                                )}
                            </FloatingLabel>

                            <Form.Check
                                type="checkbox"
                                id="agreementCheckbox"
                                label={
                                    <span className="dm-sans">
                                        Saya menyetujui{' '}
                                        <a href="privacy-policy" className="link-dark">
                                            <b>kebijakan privasi</b>
                                        </a>{' '}
                                        404 Not Books
                                    </span>
                                }
                                className="mb-3"
                                {...register('agreement', { required: 'Kamu harus menyetujui kebijakan privasi' })}
                            />
                            {errors.agreement && (
                                <Form.Text className="text-danger">{errors.agreement.message}</Form.Text>
                            )}

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-info mt-2 wide-button dm-sans"
                            >
                                {isSubmitting ? 'Loading...' : <strong>Daftar</strong>}
                            </Button>
                            <p className="mt-3 mb-5 dm-sans">
                                Sudah Punya Akun?{' '}
                                <a href="signin" className="link-dark">
                                    <b>Masuk</b>
                                </a>
                            </p>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}