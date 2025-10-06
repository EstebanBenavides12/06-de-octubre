export async function obtenerAprendices(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const aprendicesOrganizados = {};
        
        data.forEach(item => {
            const numDoc = item['Número de Documento'];
            
            if (!aprendicesOrganizados[numDoc]) {
                aprendicesOrganizados[numDoc] = {
                    'Número de Documento': numDoc,
                    'Nombre': item.Nombre,
                    'Apellidos': item.Apellidos,
                    'Estado': item.Estado,
                    'PROGRAMA': item.PROGRAMA,
                    'FICHA': item.FICHA,
                    'competencias': []
                };
            }
            
            let competenciaExistente = aprendicesOrganizados[numDoc].competencias.find(
                c => c.competencia === item.Competencia
            );
            
            if (!competenciaExistente) {
                competenciaExistente = {
                    competencia: item.Competencia,
                    resultados: []
                };
                aprendicesOrganizados[numDoc].competencias.push(competenciaExistente);
            }
            
            competenciaExistente.resultados.push({
                resultado: item['Resultado de Aprendizaje'],
                'Juicio de Evaluación': item['Juicio de Evaluación'],
                'Fecha y Hora': item['Fecha y Hora del Juicio Evaluativo'] || '',
                'Funcionario que registró el juicio evaluativo': item['Funcionario que registro el juicio evaluativo'] || ''
            });
        });
        
        return Object.values(aprendicesOrganizados);
    } catch (error) {
        console.error('Error al obtener aprendices:', error);
        return [];
    }
}
