import json
import requests
from bs4 import BeautifulSoup
import time

def scrape_stardew_valley_crop_info(json_file_path="crops.json"):
    """
    Scrapes 'infodetail' from Stardew Valley Wiki crop pages and updates a JSON file.

    Args:
        json_file_path (str): The path to the crops.json file.
    """
    base_url = "https://stardewvalleywiki.com/"

    try:
        # Load existing crop data from the JSON file
        with open(json_file_path, 'r', encoding='utf-8') as f:
            crops_data = json.load(f)
        print(f"Successfully loaded data from {json_file_path}")
    except FileNotFoundError:
        print(f"Error: {json_file_path} not found. Please ensure it exists with crop names.")
        print("Example crops.json content: [{'name': 'Strawberry', 'infodetail': ''}]")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {json_file_path}. Please check its format.")
        return

    updated_crops_count = 0
    total_crops = len(crops_data)

    for index, crop in enumerate(crops_data):
        crop_name = crop.get("name")
        if not crop_name:
            print(f"Skipping entry {index}: 'name' key missing.")
            continue

        # Format the crop name for the URL: replace spaces with underscores and capitalize each word
        # For example, "ancient fruit" becomes "Ancient_Fruit"
        page_url = f"{base_url}{crop_name.replace(' ', '_').title()}"

        #print(f"[{index + 1}/{total_crops}] Scraping: {crop_name} from {page_url}")

        try:
            # Send a GET request to the crop's wiki page
            response = requests.get(page_url, timeout=10)
            response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)

            # Parse the HTML content using BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find the 'infoboxdetail' element
            # The image shows it's a <td> with id="infoboxdetail"
            infobox_detail_element = soup.find('td', id='infoboxdetail')

            if infobox_detail_element:
                infodetail_text = infobox_detail_element.get_text(strip=True)
                crop['infodetail'] = infodetail_text
                #print(f"  - Found infodetail: '{infodetail_text[:50]}...'") # Print first 50 chars
                updated_crops_count += 1
            else:
                crop['infodetail'] = "N/A" # Set to N/A if not found
                print(f"  - Infodetail not found for {crop_name}.")

        except requests.exceptions.RequestException as e:
            crop['infodetail'] = f"Error: {e}"
            print(f"  - Request failed for {crop_name}: {e}")
        except Exception as e:
            crop['infodetail'] = f"Error: {e}"
            print(f"  - An unexpected error occurred for {crop_name}: {e}")

        # Be polite and add a small delay between requests to avoid overwhelming the server
        time.sleep(0.5)

    # Save the updated crop data back to the JSON file
    try:
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(crops_data, f, indent=4, ensure_ascii=False)
        print(f"\nSuccessfully updated {updated_crops_count} out of {total_crops} crops.")
        print(f"Updated data saved to {json_file_path}")
    except Exception as e:
        print(f"Error saving updated data to {json_file_path}: {e}")

# Example usage:
if __name__ == "__main__":
    # This script now assumes crops.json already exists and will not create a dummy one.
    # Ensure your crops.json file is present in the same directory before running.
    scrape_stardew_valley_crop_info("shared/crops.json")
