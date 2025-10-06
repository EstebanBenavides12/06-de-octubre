export function validarIngreso(usuario, contrasena) {
    if (contrasena === '06102025') {
        localStorage.setItem('usuario', usuario);
        return true;
    }
    return false;
}
