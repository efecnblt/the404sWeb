// src/components/ForgotPasswordPage.js
import React from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function ForgotPasswordPage() {
    return (
        <Container maxWidth="sm" style={{ marginTop: '5rem' }}>
            <Typography variant="h4" gutterBottom>
                Şifremi Unuttum
            </Typography>
            <Typography variant="body1" paragraph>
                Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi girin.
            </Typography>
            <form noValidate autoComplete="off">
                <TextField label="E-posta" variant="outlined" fullWidth margin="normal" />
                <Box mt={2}>
                    <Button variant="contained" color="primary" fullWidth>
                        Sıfırlama Linki Gönder
                    </Button>
                </Box>
            </form>
        </Container>
    );
}

export default ForgotPasswordPage;
