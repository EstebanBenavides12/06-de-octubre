export async function obtenerFichas() {
    const url = 'https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/JUICIOS_ADSO.json';
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
