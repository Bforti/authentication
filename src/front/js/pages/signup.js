import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from '../store/appContext'; // Importa el contexto Flux
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState(false);

    const { actions } = useContext(Context); // Obtén las acciones del contexto Flux
    const navigate = useNavigate();
    const errorRef = useRef(null); // Referencia al elemento del mensaje de error

    useEffect(() => {
        // Función para hacer scroll al mensaje de error
        const scrollToError = () => {
            if (errorRef.current) {
                errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        // Si hay un error de contraseña, hacer scroll hacia el mensaje de error después de un breve retraso
        if (passwordError) {
            const timer = setTimeout(scrollToError, 100);
            return () => clearTimeout(timer);
        }
    }, [passwordError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si algún campo está vacío
        if (email === '' || password === '' ) {
            setFormError(true);
            return;
        }

        // Resetear el estado de error del formulario
        setFormError(false);

        // Verificar si la contraseña cumple con los requisitos
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!password.match(passwordRegex)) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.');
            return;
        }

        // Llama a la acción signup para registrar al usuario
        const success = await actions.signup(email, password);

        // Si el registro es exitoso, redirige al usuario a la página de inicio de sesión
        if (success) {
            navigate('/login');
        }
    };

    const handleLogin = () => {
        navigate('/');
    };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1>Sign-up</h1>
       
        <div className='mb-3'>
          <label htmlFor='exampleInputEmail1' className='form-label'>Email address</label>
          <input
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            className={`form-control ${formError && email === '' ? 'error' : ''}`}
            id='email'
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='exampleInputPassword1' className='form-label'>Password</label>
          <input
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${formError && password === '' ? 'error' : ''}`}
            id='password'
          />
          {passwordError && <div className="error-message" ref={errorRef}>{passwordError}</div>}
        </div>
       
        <button
          style={{ cursor: 'pointer' }}
          type='submit'
          className='btn btn-success'
        >Create account</button>

        <div className='mb-3 pt-5  mx-auto'>
          <h5
            className='text-center'
            style={{ cursor: 'pointer' }}
            onClick={handleLogin}
          >If you already have an account go to Login
          </h5>
        </div>
      </div>
    </form>
  )
};

export default Signup
