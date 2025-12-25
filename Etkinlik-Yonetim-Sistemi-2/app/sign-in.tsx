
import { router } from 'expo-router';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useSession } from '@/context/ctx';
import { useState } from 'react';

export default function SignIn() {
    const { signIn } = useSession();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        if (!user || !pass) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }
        setLoading(true);
        setError('');

        const success = await signIn(user, pass);
        setLoading(false);

        if (success) {
            // Navigate to tabs
            // router.replace('/'); // Removed: Layout handles navigation based on session/role
        } else {
            setError('Giriş başarısız. Kullanıcı adı veya şifre hatalı.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Etkinlik Yönetim</Text>
            <Text style={styles.subtitle}>Giriş Yap</Text>

            <TextInput
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#666"
                style={styles.input}
                value={user}
                onChangeText={setUser}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Şifre"
                placeholderTextColor="#666"
                style={styles.input}
                secureTextEntry
                value={pass}
                onChangeText={setPass}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Giriş Yap</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/sign-up')}>
                <Text style={styles.signUpText}>Hesabın yok mu? Hemen kayıt ol</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#0a0e17',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#fff',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
        color: '#8899a6',
    },
    input: {
        backgroundColor: '#151f2b',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#253341',
        color: '#fff',
    },
    button: {
        backgroundColor: '#1d9bf0',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        textAlign: 'center',
        marginBottom: 15,
    },
    signUpButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    signUpText: {
        color: '#1d9bf0',
        fontSize: 14,
    }
});
