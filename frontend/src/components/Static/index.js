import React from 'react';

function RelatorioIntegrado() {
    return (
        <iframe
            src="/static.html"
            title="Relatório Completo"
            style={{
                flex: 1,
                border: 'none',
                width: '100%',
                height: 'calc(99vh - 94px)',
            }}
        ></iframe>
    );
}

export default RelatorioIntegrado;
