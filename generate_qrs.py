import qrcode
from PIL import Image
import csv
import os

def generate_qr_with_logo(link, logo_path, output_path):
    # Set up the QR code
    qr = qrcode.QRCode(
        version=4, # Adjust version depending on the complexity of the URL
        error_correction=qrcode.constants.ERROR_CORRECT_H, # High error correction to allow logo
        box_size=10,
        border=4,
    )
    qr.add_data(link)
    qr.make(fit=True)

    # Create the QR code image
    qr_img = qr.make_image(fill_color="lightgreen", back_color="white").convert('RGB')

    # Load the logo image and convert to black & white (grayscale)
    try:
        logo = Image.open(logo_path).convert('L').convert('RGB')
    except FileNotFoundError:
        print(f"Error: Logo file not found at {logo_path}")
        return

    # Calculate the size of the logo (e.g., 1/4th of the QR code size)
    basewidth = int(qr_img.size[0] / 4)
    wpercent = (basewidth / float(logo.size[0]))
    hsize = int((float(logo.size[1]) * float(wpercent)))
    logo = logo.resize((basewidth, hsize), Image.LANCZOS)

    # Calculate the position to place the logo (center)
    pos = ((qr_img.size[0] - logo.size[0]) // 2, (qr_img.size[1] - logo.size[1]) // 2)

    # Paste the logo onto the QR code
    qr_img.paste(logo, pos)

    # Save the final image
    qr_img.save(output_path)
    print(f"Generated QR code for {link} at {output_path}")

def main():
    csv_file = 'links.csv'
    logo_file = os.path.join('src', 'assets', 'logo.png')
    output_dir = 'output_qrs'

    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Read links from CSV and generate QR codes
    try:
        with open(csv_file, mode='r') as file:
            csv_reader = csv.reader(file)
            for i, row in enumerate(csv_reader):
                if row: # Check if row is not empty
                    link = row[0]
                    output_path = os.path.join(output_dir, f'qr_code_{i+1}.png')
                    generate_qr_with_logo(link, logo_file, output_path)
    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_file}. Please create one with links in the first column.")

if __name__ == "__main__":
    main()
