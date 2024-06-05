import React, { useContext, useEffect } from 'react';
import { Context } from '../store/appContext'; // Importa el contexto Flux
import { useNavigate } from 'react-router-dom';

export const Private = () => {
    const { store, actions } = useContext(Context); 
    const navigate = useNavigate(); 

  
    useEffect(() => {
        if (!store.token) {
           
            navigate('/login');
        }
    }, [store.token, navigate]);
    const handleLogout = () => {
        actions.logout(); // Ejecutar la acción de cierre de sesión del contexto Flux
        navigate('/'); // Redirigir al usuario al inicio de sesión después de cerrar sesión
    };

    return (
        <div className="container p-3">
            <h1>Private Page</h1>
          
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
           
        </div>
    );

    
};

export default Private;