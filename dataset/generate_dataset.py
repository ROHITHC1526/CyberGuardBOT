"""
Generate a sample SMS/Email scam dataset for training.
Creates a CSV file with message and label columns.
"""

import pandas as pd
import random
import os

def generate_scam_messages(count=5000):
    """Generate diverse scam message templates."""
    scam_templates = [
        # Urgency scams
        ["URGENT! Your {account_type} account has been {action}. Click here immediately: {url}",
         "Your {account_type} will be {action} in {time}. Verify now: {url}",
         "URGENT MESSAGE: {issue} requires immediate attention. Click: {url}",
         "Action required immediately! Your {account_type} needs verification: {url}"],
        
        # Prize/Winner scams
        ["Congratulations! You have won ${amount}! Call {phone} to claim your prize!",
         "You've been selected! You won ${amount}! Text CLAIM to {phone}",
         "You are the {number} visitor! Claim your free {item} now! {url}",
         "Congratulations! ${amount} prize waiting! Act now: {url}"],
        
        # Tax refund scams
        ["Your tax refund of ${amount} is ready. Click here to claim: {url}",
         "IRS Alert: ${amount} refund pending. Verify: {url}",
         "Tax refund approved! Claim ${amount} now: {url}"],
        
        # Account verification scams
        ["Your {account_type} needs verification. Update info: {url}",
         "Account suspended due to suspicious activity. Verify: {url}",
         "Your {account_type} will be locked. Confirm details: {url}",
         "Security alert: Verify your {account_type} now: {url}"],
        
        # Package/Delivery scams
        ["Your package delivery failed. Pay ${fee} to reschedule: {url}",
         "UPS: Package delivery issue. Update address: {url}",
         "FedEx: Your package needs verification. Click: {url}"],
        
        # Banking scams
        ["Your bank account needs verification. Click: {url}",
         "Suspicious activity on your account. Verify: {url}",
         "Your card will be blocked. Update now: {url}",
         "Bank alert: Verify transaction of ${amount}: {url}"],
        
        # Tech support scams
        ["Microsoft: Your computer has a virus. Call {phone}",
         "Apple: Your iCloud account is locked. Unlock: {url}",
         "Windows Security Alert: Click to scan: {url}"],
        
        # Romance scams
        ["Hi beautiful, I'm {name}. Let's chat and get to know each other.",
         "I saw your profile and I'm interested. Message me at {url}",
         "You seem amazing. Want to connect? {url}"],
        
        # Loan/Investment scams
        ["Get approved for a ${amount} loan with 0% interest! Apply: {url}",
         "Investment opportunity! Double your money in 30 days. Join: {url}",
         "Guaranteed returns! Invest ${amount} and get 10x back: {url}"],
        
        # Free offer scams
        ["Free {item}! Limited time offer. Claim now: {url}",
         "Get free ${amount} gift card! Just pay shipping: {url}",
         "Congratulations! You qualify for a free {item}: {url}"]
    ]
    
    # Variations for placeholders
    account_types = ["bank", "PayPal", "Amazon", "Netflix", "credit card", "email", "iCloud", "Facebook"]
    actions = ["suspended", "locked", "closed", "compromised", "frozen"]
    times = ["24 hours", "48 hours", "today", "2 days", "3 hours"]
    issues = ["Unauthorized login", "Suspicious activity", "Failed verification", "Payment issue"]
    amounts = ["500", "1,000", "2,500", "5,000", "10,000", "50,000", "100,000"]
    fees = ["5.99", "9.99", "12.99", "19.99", "24.99"]
    phones = ["1-800-WINNER", "1-888-456-7890", "+1-555-123-4567", "18005551234"]
    items = ["iPhone", "iPad", "laptop", "tablet", "watch", "TV", "gift card"]
    numbers = ["1,000th", "10,000th", "100,000th", "millionth"]
    urls = ["verify-now.com", "secure-bank.com", "claim-prize.net", "update-info.org", 
            "taxrefund.gov", "delivery-update.com", "account-verify.net"]
    names = ["John", "Sarah", "Michael", "Emily", "David", "Jessica"]
    
    messages = []
    
    for _ in range(count):
        # Pick a random template category
        category = random.choice(scam_templates)
        template = random.choice(category)
        
        # Fill placeholders
        message = template.format(
            account_type=random.choice(account_types),
            action=random.choice(actions),
            time=random.choice(times),
            issue=random.choice(issues),
            amount=random.choice(amounts),
            fee=random.choice(fees),
            phone=random.choice(phones),
            item=random.choice(items),
            number=random.choice(numbers),
            url=random.choice(urls),
            name=random.choice(names)
        )
        
        # Add variations
        if random.random() < 0.3:
            message = message.upper()  # All caps sometimes
        if random.random() < 0.4:
            message = message.replace('.', '!')  # Exclamation marks
        if random.random() < 0.2:
            # Add extra urgency
            urgency_prefixes = ["URGENT: ", "⚠️ ", "ALERT: ", "WARNING: "]
            message = random.choice(urgency_prefixes) + message
        
        messages.append(message)
    
    return messages

def generate_ham_messages(count=5000):
    """Generate legitimate (ham) message templates."""
    ham_templates = [
        # Casual conversations
        ["Hey, are you free for {activity} {time}?",
         "Want to grab {food} later?",
         "Can we reschedule our {meeting_type}?",
         "Thanks for {action}! Really appreciate it."],
        
        # Work/Professional
        ["The meeting is scheduled for {time} in {location}.",
         "Can you send me the {document_type} when you get a chance?",
         "I'll review the {project_type} and get back to you.",
         "Please find attached the {file_type}."],
        
        # Personal messages
        ["Happy birthday! Hope you have a great day!",
         "Just wanted to check in and see how you're doing.",
         "Thanks for the {item}. It's exactly what I needed!",
         "Hope you're having a good week!"],
        
        # Reminders
        ["Don't forget about {event} {time}.",
         "Reminder: {task} due by {time}.",
         "Just a reminder to {action}."],
        
        # Informational
        ["The weather looks great today. Perfect for {activity}.",
         "I'll be running about {time} late for our appointment.",
         "Let me know your availability for a {call_type} call."],
        
        # Confirmations
        ["Got it! See you {time}.",
         "Sounds good. Looking forward to it!",
         "Perfect, I'll see you then.",
         "Confirmed! Thanks for letting me know."],
        
        # Questions
        ["Do you know where {place} is?",
         "What time works best for you?",
         "Can you help me with {task}?"],
        
        # Apologies
        ["Sorry I'm running late. Be there in {time}.",
         "Apologies for the delay. Thanks for your patience.",
         "Sorry about the confusion. Let me clarify."],
        
        # Appointments
        ["Your appointment with {name} is on {date} at {time}.",
         "Appointment confirmed for {date} at {time}.",
         "We'll see you on {date} at {time}."],
        
        # Social
        ["Are you coming to {event} this weekend?",
         "Would you like to join us for {activity}?",
         "We're meeting at {place} if you want to come."]
    ]
    
    # Variations
    activities = ["lunch", "dinner", "coffee", "a walk", "the movies", "a game"]
    times = ["tomorrow", "next week", "Friday", "this afternoon", "3 PM", "next month"]
    foods = ["lunch", "dinner", "coffee", "a drink", "pizza"]
    meeting_types = ["meeting", "call", "appointment", "session"]
    actions = ["your help", "the update", "doing that", "your time"]
    locations = ["the conference room", "my office", "the main hall", "room 101"]
    document_types = ["report", "presentation", "document", "file", "data"]
    project_types = ["proposal", "document", "report", "presentation"]
    file_types = ["document", "report", "file", "data"]
    items = ["book", "email", "message", "call"]
    events = ["the meeting", "the party", "dinner", "the event"]
    tasks = ["submit the form", "send the email", "call back", "reply"]
    call_types = ["quick", "brief", "scheduled"]
    places = ["the restaurant", "the office", "the store", "the cafe"]
    names = ["Dr. Smith", "John", "Sarah", "the team"]
    dates = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    
    messages = []
    
    for _ in range(count):
        category = random.choice(ham_templates)
        template = random.choice(category)
        
        message = template.format(
            activity=random.choice(activities),
            time=random.choice(times),
            food=random.choice(foods),
            meeting_type=random.choice(meeting_types),
            action=random.choice(actions),
            location=random.choice(locations),
            document_type=random.choice(document_types),
            project_type=random.choice(project_types),
            file_type=random.choice(file_types),
            item=random.choice(items),
            event=random.choice(events),
            task=random.choice(tasks),
            call_type=random.choice(call_types),
            place=random.choice(places),
            name=random.choice(names),
            date=random.choice(dates)
        )
        
        messages.append(message)
    
    return messages

def generate_dataset(output_path="dataset/scam_dataset.csv", total_samples=10000):
    """Generate complete dataset with scam and ham messages."""
    print("=" * 60)
    print("Generating Scam Detection Dataset")
    print("=" * 60)
    
    # Ensure balanced dataset
    scam_count = total_samples // 2
    ham_count = total_samples // 2
    
    print(f"\nGenerating {scam_count} scam messages...")
    scam_messages = generate_scam_messages(scam_count)
    
    print(f"Generating {ham_count} legitimate messages...")
    ham_messages = generate_ham_messages(ham_count)
    
    # Combine and shuffle
    print("\nCombining and shuffling dataset...")
    all_messages = []
    
    # Add scam messages with label
    for msg in scam_messages:
        all_messages.append({"message": msg, "label": 1})
    
    # Add ham messages with label
    for msg in ham_messages:
        all_messages.append({"message": msg, "label": 0})
    
    # Shuffle
    random.shuffle(all_messages)
    
    # Create DataFrame
    df = pd.DataFrame(all_messages)
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else '.', exist_ok=True)
    
    # Save to CSV
    df.to_csv(output_path, index=False, encoding='utf-8')
    
    print(f"\n✅ Dataset saved to: {output_path}")
    print(f"   Total messages: {len(df)}")
    print(f"   Scam messages: {df['label'].sum()}")
    print(f"   Legitimate messages: {len(df) - df['label'].sum()}")
    print(f"   Columns: {list(df.columns)}")
    print("\n" + "=" * 60)
    print("Dataset generation completed!")
    print("=" * 60)
    
    return df

if __name__ == "__main__":
    # Generate 10,000 samples
    import sys
    import os
    
    # Get the script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "scam_dataset.csv")
    
    generate_dataset(output_path, total_samples=10000)
