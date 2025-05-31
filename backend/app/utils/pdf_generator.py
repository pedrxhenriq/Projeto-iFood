from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

def gerar_pdf_pedido(pedido_id, itens, total):
    caminho_pdf = f'/tmp/pedido_{pedido_id}.pdf'
    doc = SimpleDocTemplate(caminho_pdf, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    elements.append(Paragraph(f"Resumo do Pedido #{pedido_id}", styles['Title']))

    dados = [['Produto', 'Quantidade', 'Preço']]
    for item in itens:
        dados.append([item['name'], item['quantity'], f"R$ {item['price']:.2f}"])

    dados.append(['', 'Total:', f"R$ {total:.2f}"])

    tabela = Table(dados)
    tabela.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ]))

    elements.append(tabela)
    doc.build(elements)
    return caminho_pdf
