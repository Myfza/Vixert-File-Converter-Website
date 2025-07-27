import os
import argparse
from PIL import Image
from pdf2image import convert_from_path
from docx import Document
from fpdf import FPDF

def pdf_to_image(input_file, output_dir, output_format):
    try:
        images = convert_from_path(input_file)
        for i, image in enumerate(images):
            image.save(os.path.join(output_dir, f'output_{i + 1}.{output_format}'), output_format.upper())
    except Exception as e:
        print(f"Error converting PDF to image: {e}")

def pdf_to_docx(input_file, output_file):
    # Placeholder for PDF to DOCX conversion logic
    print("PDF to DOCX conversion is not implemented yet.")

def docx_to_pdf(input_file, output_file):
    doc = Document(input_file)
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    for para in doc.paragraphs:
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, para.text)
    
    pdf.output(output_file)

def image_to_image(input_file, output_format):
    try:
        img = Image.open(input_file)
        output_file = os.path.splitext(input_file)[0] + f'.{output_format}'
        img.save(output_file, output_format.upper())
    except Exception as e:
        print(f"Error converting image: {e}")

def main():
    parser = argparse.ArgumentParser(description='File Converter CLI')
    parser.add_argument('--input', required=True, help='Input file path')
    parser.add_argument('--output_format', required=True, help='Output format (jpg, png, docx, pdf)')
    parser.add_argument('--output_dir', default='.', help='Output directory (default: current directory)')

    args = parser.parse_args()

    input_file = args.input
    output_format = args.output_format.lower()
    output_dir = args.output_dir

    if not os.path.isfile(input_file):
        print("Error: Input file not found.")
        return

    if output_format == 'jpg' or output_format == 'png':
        pdf_to_image(input_file, output_dir, output_format)
    elif output_format == 'docx':
        pdf_to_docx(input_file, os.path.join(output_dir, 'output.docx'))
    elif output_format == 'pdf':
        docx_to_pdf(input_file, os.path.join(output_dir, 'output.pdf'))
    elif output_format in ['jpg', 'png']:
        image_to_image(input_file, output_format)
    else:
        print("Error: Unsupported output format.")

if __name__ == '__main__':
    main()
