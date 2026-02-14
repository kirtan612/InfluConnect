"""
Test email sending functionality.
Run this to verify SMTP configuration.
"""
from app.services.email_service import send_email, send_password_reset_email

def test_simple_email():
    """Test sending a simple email."""
    print("\n" + "="*60)
    print("TEST 1: Simple Email")
    print("="*60)
    
    success = send_email(
        to="kirtanjogani3@gmail.com",  # Change to your email
        subject="Test Email from InfluConnect",
        body="This is a test email to verify SMTP configuration.",
        html_body="<h1>Test Email</h1><p>This is a test email to verify SMTP configuration.</p>"
    )
    
    if success:
        print("✓ Test email sent successfully!")
        print("Check your inbox at: kirtanjogani3@gmail.com")
    else:
        print("❌ Failed to send test email")
        print("Check the error messages above")
    
    return success


def test_password_reset_email():
    """Test sending a password reset email."""
    print("\n" + "="*60)
    print("TEST 2: Password Reset Email")
    print("="*60)
    
    # Generate a fake token for testing
    fake_token = "test_token_abc123xyz789"
    
    success = send_password_reset_email(
        to="kirtanjogani3@gmail.com",  # Change to your email
        reset_token=fake_token,
        frontend_url="http://localhost:5173"
    )
    
    if success:
        print("✓ Password reset email sent successfully!")
        print("Check your inbox at: kirtanjogani3@gmail.com")
        print(f"Reset URL: http://localhost:5173/reset-password?token={fake_token}")
    else:
        print("❌ Failed to send password reset email")
        print("Check the error messages above")
    
    return success


if __name__ == "__main__":
    print("\n" + "="*60)
    print("EMAIL SERVICE TEST")
    print("="*60)
    print("\nThis will test email sending using your SMTP configuration.")
    print("Make sure you have configured SMTP settings in backend/.env")
    print("\nSMTP Settings:")
    print("- Server: smtp.gmail.com")
    print("- Port: 587")
    print("- User: kirtanjogani3@gmail.com")
    print("- Password: (configured in .env)")
    
    input("\nPress Enter to start tests...")
    
    # Run tests
    test1_passed = test_simple_email()
    test2_passed = test_password_reset_email()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"Simple Email: {'✓ PASSED' if test1_passed else '❌ FAILED'}")
    print(f"Password Reset Email: {'✓ PASSED' if test2_passed else '❌ FAILED'}")
    
    if test1_passed and test2_passed:
        print("\n✓ All tests passed! Email service is working correctly.")
        print("Check your inbox at: kirtanjogani3@gmail.com")
    else:
        print("\n❌ Some tests failed. Check the error messages above.")
        print("\nCommon issues:")
        print("1. Wrong App Password - Generate new one at: https://myaccount.google.com/apppasswords")
        print("2. 2FA not enabled - Enable at: https://myaccount.google.com/security")
        print("3. Wrong SMTP settings - Check backend/.env file")
    
    print("\n" + "="*60)
