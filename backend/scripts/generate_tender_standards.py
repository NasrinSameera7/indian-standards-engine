import json
import os

common_products = [
    "Portland Cement", "Steel TMT Rebar", "Bitumen for Roads", "HDPE Pipes",
    "LED Street Lights", "CCTV Surveillance Cameras", "Hospital Beds", "School Desks",
    "Electric Buses", "Diesel Generators", "Laptops for Government", "Server Racks",
    "Office Chairs", "Fire Extinguishers", "Air Conditioners", "Water Purifiers",
    "Solar Inverters", "Power Transformers", "Copper Cables", "Fiber Optic Cables",
    "Traffic Lights", "Paver Blocks", "Surgical Gloves", "N95 Masks",
    "Ambulances", "Police Uniforms", "Safety Helmets", "Reflective Jackets",
    "Desktop Computers", "Printers and Scanners", "Interactive Whiteboards",
    "Playground Equipment", "Garbage Trucks", "Sewage Treatment Plants",
    "Water Meters", "Smart Electricity Meters", "Submersible Pumps",
    "Tractors", "Fertilizers", "Pesticides", "Cold Storage Units",
    "Vaccine Refrigerators", "X-Ray Machines", "Ultrasound Machines",
    "Wheelchairs", "Oxygen Cylinders", "Blood Bank Refrigerators",
    "Incinerators", "Biometric Attendance Machines", "UPS Systems",
    "Batteries for UPS", "Solar Street Lights", "Wind Turbines",
    "Biogas Plants", "Electric Vehicle Chargers", "Drones for Surveillance",
    "Body Worn Cameras", "Breathalyzers", "Speed Radar Guns",
    "Fire Tenders", "Rescue Boats", "Life Jackets", "Tents for Disaster Relief",
    "Tarpaulins", "Blankets", "Mosquito Nets", "Food Rations",
    "Mid-Day Meal Utensils", "Library Books", "Science Lab Equipment",
    "Sports Equipment", "Musical Instruments", "Art Supplies",
    "Stationery Items", "Printer Ink and Toner", "Cleaning Supplies",
    "Disinfectants", "Hand Sanitizers", "Toilet Paper", "Garbage Bins",
    "Sweeping Machines", "Vacuum Cleaners", "Lawn Mowers",
    "Water Sprinklers", "Fencing Wire", "Barbed Wire", "Chain Link Fencing",
    "Gate Valves", "Sluice Valves", "Check Valves", "Butterfly Valves",
    "Cast Iron Pipes", "Ductile Iron Pipes", "PVC Pipes", "CPVC Pipes",
    "Galvanized Iron Pipes", "Mild Steel Pipes", "Stainless Steel Pipes",
    "Roofing Sheets", "Cement Corrugated Sheets", "Color Coated Sheets",
    "Polycarbonate Sheets", "Asbestos Sheets", "Plywood", "Particle Board",
    "MDF Board", "Flush Doors", "PVC Doors", "Aluminum Windows",
    "Glass Panes", "Ceramic Tiles", "Vitrified Tiles", "Marble Slabs",
    "Granite Slabs", "Sanitary Wares", "Wash Basins", "Water Closets",
    "Urinals", "Faucets and Taps", "Shower Heads", "Plumbing Fittings",
    "Electrical Switches", "Sockets and Plugs", "MCBs and RCCBs",
    "Distribution Boards", "Electrical Conduits", "Lighting Fixtures",
    "Ceiling Fans", "Exhaust Fans", "Pedestal Fans", "Wall Fans",
    "Geysers and Water Heaters", "Room Heaters", "Coolers",
    "Refrigerators", "Deep Freezers", "Microwave Ovens", "Induction Cooktops",
    "Mixer Grinders", "Commercial Kitchen Equipment", "Chapati Making Machines",
    "Dishwashers", "Washing Machines", "Industrial Laundry Equipment",
    "Ironing Machines", "Sewing Machines", "Textile Looms",
    "Spinning Machines", "Welding Machines", "Lathe Machines",
    "Milling Machines", "Drilling Machines", "Grinding Machines",
    "CNC Machines", "Hydraulic Presses", "Air Compressors",
    "Pneumatic Tools", "Hand Tools", "Power Tools", "Measuring Instruments",
    "Vernier Calipers", "Micrometers", "Multimeters", "Oscilloscopes",
    "Spectrophotometers", "Microscopes", "Telescopes", "Surveying Instruments",
    "Theodolites", "Total Stations", "GPS Receivers", "Seismographs",
    "Weather Stations", "Radar Systems", "Sonar Systems", "Communication Radios",
    "Walkie Talkies", "Satellite Phones", "Mobile Phones", "Tablets",
    "Projectors", "Audio Systems", "Public Address Systems", "Microphones",
    "Speakers", "Amplifiers", "Televisions", "Display Monitors",
    "Digital Signage", "Video Conferencing Systems", "Networking Switches",
    "Routers", "Firewalls", "Servers", "Storage Area Networks"
]

data_path = "../data/sample_standards.json"

with open(data_path, 'r', encoding='utf-8-sig') as f:
    standards = json.load(f)

new_standards = []
start_is_num = 20000

for i in range(200):
    product = common_products[i % len(common_products)]
    new_std = {
        "is_number": f"IS {start_is_num + i}",
        "title": f"{product} - Specification and Guidelines",
        "description": f"Provides comprehensive specifications, quality requirements, and safety guidelines for the procurement, testing, and deployment of {product} in public and private sector projects.",
        "status": "CURRENT",
        "is_mandatory_certification": True if i % 3 == 0 else False
    }
    new_standards.append(new_std)

all_standards = new_standards + standards

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(all_standards, f, indent=2)

print(f"Added 200 new tender product standards. Total records: {len(all_standards)}")
