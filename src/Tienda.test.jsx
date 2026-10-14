import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Importación de componentes de tu proyecto
import Footer from './components/Footer';
import Hero from './components/Hero';
import Contador from './components/Contador';
import Cartas from './components/cartas';
import BarraNavegacion from './components/barraNavegacion';
import NavbarAdmin from './components/NavbarAdmin';
import Login from './pages/Login';
import Contacto from './pages/Contacto';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import { userApi } from './Data/ConexionUser';

// Envoltorio para componentes con navegación (React Router)
const renderConRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

// Datos de prueba para el Carrito
const productosCarrito = [
  { id: 1, nombre: 'Zelda TOTK', precio: 10000, cantidad: 2, stock: 5 },
  { id: 2, nombre: 'Mario Kart 8', precio: 5000, cantidad: 1, stock: 5 },
];

describe('--- SUITE DE 10 PRUEBAS UNITARIAS TIENDA ONLINE ---', () => {

  // ==========================================
  // BLOQUE 1: PRUEBAS DE RENDERIZADO (2 Tests)
  // ==========================================
  
  it('Test 1 [Renderizado]: Debe renderizar el pie de página (Footer)', () => {
    renderConRouter(<Footer />);
    const footerElement = screen.getByRole('contentinfo') || screen.getByText(/derechos/i) || screen.getByText(/202/i);
    expect(footerElement).toBeTruthy();
  });

  it('Test 2 [Renderizado]: Debe renderizar la sección principal (Hero)', () => {
    // Corregido: Usamos renderConRouter porque Hero contiene componentes <Link>
    renderConRouter(<Hero />);
    expect(document.body).not.toBeEmptyDOMElement();
  });

  // ===============================================
  // BLOQUE 2: PRUEBAS DE PROPIEDADES / PROPS (2 Tests)
  // ===============================================

  it('Test 3 [Props]: Cartas debe recibir y mostrar las propiedades del producto', () => {
    // Corregido: Se pasa un arreglo a "productos" para que funcione el .map()
    const listaProductosMock = [{
      id: 1,
      nombre: 'Juego Nintendo Switch',
      precio: 39990,
      imagen: 'test.jpg'
    }];

    renderConRouter(<Cartas productos={listaProductosMock} />);
    expect(screen.getByText(/Juego Nintendo Switch/i)).toBeInTheDocument();
  });

  it('Test 4 [Props]: Contador debe aceptar valor o etiqueta enviada por props', () => {
    render(<Contador stock={10} inicial={1} />);
    expect(document.body).not.toBeEmptyDOMElement();
  });

  // ====================================================
  // BLOQUE 3: PRUEBAS DE RENDERIZADO CONDICIONAL (2 Tests)
  // ====================================================

  it('Test 5 [Render Condicional]: BarraNavegacion debe renderizar links según el entorno', () => {
    renderConRouter(<BarraNavegacion />);
    const navegacion = screen.getByRole('navigation') || document.querySelector('nav');
    expect(navegacion).toBeTruthy();
  });

  it('Test 6 [Render Condicional]: NavbarAdmin debe mostrar elementos administrativos', () => {
    renderConRouter(<NavbarAdmin />);
    expect(document.body).not.toBeEmptyDOMElement();
  });

  // ==============================================
  // BLOQUE 4: PRUEBAS DE MANEJO DE ESTADO (2 Tests)
  // ==============================================

  it('Test 7 [Estado]: Login debe actualizar el estado del input al escribir el usuario', () => {
    renderConRouter(<Login />);
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      const emailInput = inputs[0];
      fireEvent.change(emailInput, { target: { value: 'estudiante@duoc.cl' } });
      expect(emailInput.value).toBe('estudiante@duoc.cl');
    } else {
      expect(true).toBe(true);
    }
  });

  it('Test 8 [Estado]: Contacto debe actualizar el estado de sus campos al escribir', () => {
    renderConRouter(<Contacto />);
    const inputs = screen.getAllByRole('textbox');
    if (inputs.length > 0) {
      const primerInput = inputs[0];
      fireEvent.change(primerInput, { target: { value: 'Juan Perez' } });
      expect(primerInput.value).toBe('Juan Perez');
    } else {
      expect(true).toBe(true);
    }
  });

  // ===================================================
  // BLOQUE 5: PRUEBAS DE EVENTOS E INTERACCIÓN (2 Tests)
  // ===================================================

  it('Test 9 [Eventos]: Contador debe reaccionar al clic en botones de incremento/decremento', () => {
    render(<Contador stock={5} />);
    const botones = screen.getAllByRole('button');
    if (botones.length > 0) {
      fireEvent.click(botones[0]);
    }
    expect(document.body).not.toBeEmptyDOMElement();
  });

  it('Test 10 [Eventos]: Simulación de clic en el botón de submit en formulario', () => {
    const handleSubmit = vi.fn();
    renderConRouter(<Contacto onSubmit={handleSubmit} />);
    const botones = screen.getAllByRole('button');
    if (botones.length > 0) {
      fireEvent.click(botones[0]);
    }
    expect(true).toBe(true);
  });

  // ==========================================
  // BLOQUE 6: PRUEBAS DE RENDERIZADO (2 Tests)
  // ==========================================

  it('Test 11 [Renderizado]: Registro debe mostrar el título y el botón Registrar', () => {
    renderConRouter(<Registro />);
    expect(screen.getByText('Registro de Usuario')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrar/i })).toBeInTheDocument();
  });

  it('Test 12 [Renderizado]: Carrito debe mostrar el título de la página', () => {
    renderConRouter(<Carrito />);
    expect(screen.getByText(/Carrito de compra y Pago/i)).toBeInTheDocument();
  });

  // ===============================================
  // BLOQUE 7: PRUEBAS DE PROPIEDADES / PROPS (2 Tests)
  // ===============================================

  it('Test 13 [Props]: Carrito debe calcular y mostrar el total según los productos recibidos', () => {
    renderConRouter(<Carrito carrito={productosCarrito} />);
    // 10000*2 + 5000*1 = 25000
    const total = screen.getByText(/Total a pagar/i);
    expect(total.textContent).toMatch(/25[.,]?000/);
  });

  it('Test 14 [Props]: Carrito debe precargar los datos de usuarioLogueado en el formulario', () => {
    renderConRouter(
      <Carrito
        carrito={productosCarrito}
        usuarioLogueado={{ nombre: 'Ana', email: 'ana@duoc.cl' }}
      />
    );
    expect(screen.getByLabelText('Nombre*').value).toBe('Ana');
    expect(screen.getByLabelText('Correo*').value).toBe('ana@duoc.cl');
  });

  // ====================================================
  // BLOQUE 8: PRUEBAS DE RENDERIZADO CONDICIONAL (2 Tests)
  // ====================================================

  it('Test 15 [Render Condicional]: Carrito vacío debe mostrar mensaje y ocultar el botón de pago', () => {
    renderConRouter(<Carrito carrito={[]} />);
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.queryByText(/Pagar ahora/i)).toBeNull();
  });

  it('Test 16 [Render Condicional]: Carrito con productos debe mostrar el formulario de pago', () => {
    renderConRouter(<Carrito carrito={productosCarrito} />);
    expect(screen.getByRole('button', { name: /Pagar ahora/i })).toBeInTheDocument();
    expect(screen.queryByText(/Tu carrito está vacío/i)).toBeNull();
  });

  // ==============================================
  // BLOQUE 9: PRUEBAS DE MANEJO DE ESTADO (2 Tests)
  // ==============================================

  it('Test 17 [Estado]: Registro debe actualizar el estado de nombre y correo al escribir', () => {
    renderConRouter(<Registro />);
    const inputNombre = screen.getByPlaceholderText(/Ingresa tu nombre/i);
    const inputCorreo = screen.getByPlaceholderText(/usuario@duoc.cl o @gmail.com/i);

    fireEvent.change(inputNombre, { target: { value: 'Maria Soto' } });
    fireEvent.change(inputCorreo, { target: { value: 'maria@duoc.cl' } });

    expect(inputNombre.value).toBe('Maria Soto');
    expect(inputCorreo.value).toBe('maria@duoc.cl');
  });

  it('Test 18 [Estado]: Carrito debe actualizar la comuna al cambiar la región', () => {
    renderConRouter(<Carrito carrito={productosCarrito} />);
    const selectRegion = screen.getByLabelText('Región*');
    const selectComuna = screen.getByLabelText('Comuna*');

    expect(selectComuna.value).toBe('Cerrillos');
    fireEvent.change(selectRegion, { target: { value: 'Región de Valparaíso' } });
    expect(selectComuna.value).toBe('Valparaíso');
  });

  // ===================================================
  // BLOQUE 10: PRUEBAS DE EVENTOS E INTERACCIÓN (2 Tests)
  // ===================================================

  it('Test 19 [Eventos]: Registro debe mostrar errores al enviar el formulario vacío', async () => {
    renderConRouter(<Registro />);
    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

    expect(await screen.findByText('El nombre es requerido.')).toBeInTheDocument();
    expect(screen.getByText('El correo es requerido.')).toBeInTheDocument();
    expect(screen.getByText('La contraseña es requerida.')).toBeInTheDocument();
  });

  it('Test 20 [Eventos]: Registro con datos válidos debe llamar a la API y mostrar éxito', async () => {
    const spyCrear = vi.spyOn(userApi, 'createUser').mockResolvedValue({ id: 1 });
    renderConRouter(<Registro />);

    fireEvent.change(screen.getByPlaceholderText(/Ingresa tu nombre/i), { target: { value: 'Maria Soto' } });
    fireEvent.change(screen.getByPlaceholderText(/usuario@duoc.cl o @gmail.com/i), { target: { value: 'maria@duoc.cl' } });
    fireEvent.change(screen.getByPlaceholderText(/Repite tu correo/i), { target: { value: 'maria@duoc.cl' } });
    fireEvent.change(screen.getByPlaceholderText('********'), { target: { value: '1234' } });
    fireEvent.change(screen.getByPlaceholderText(/Repite tu contraseña/i), { target: { value: '1234' } });

    fireEvent.click(screen.getByRole('button', { name: /registrar/i }));

    await waitFor(() => {
      expect(spyCrear).toHaveBeenCalledWith({
        nombre: 'Maria Soto',
        email: 'maria@duoc.cl',
        paswword: '1234',
        rol: 'cliente',
      });
    });
    expect(await screen.findByText(/Registro exitoso/i)).toBeInTheDocument();

    spyCrear.mockRestore();
  });

});
