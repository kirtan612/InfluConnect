"""
Migration script to integrate campaign-based escrow system.
Adds wallet fields to users and escrow fields to campaigns.
"""
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost/influconnect')

def run_migration():
    """Run the campaign escrow integration migration."""
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("Starting Campaign Escrow Integration Migration...")
        print("=" * 60)
        
        # 1. Add wallet fields to users table
        print("\n1. Adding wallet fields to users table...")
        try:
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10,2) DEFAULT 0.00,
                ADD COLUMN IF NOT EXISTS locked_balance DECIMAL(10,2) DEFAULT 0.00;
            """))
            conn.commit()
            print("✓ Wallet fields added to users")
        except Exception as e:
            print(f"Note: {e}")
        
        # 2. Add escrow fields to campaigns table
        print("\n2. Adding escrow fields to campaigns table...")
        try:
            conn.execute(text("""
                ALTER TABLE campaigns 
                ADD COLUMN IF NOT EXISTS budget_amount DECIMAL(10,2),
                ADD COLUMN IF NOT EXISTS brand_fee DECIMAL(10,2) DEFAULT 0.00,
                ADD COLUMN IF NOT EXISTS influencer_fee DECIMAL(10,2) DEFAULT 0.00,
                ADD COLUMN IF NOT EXISTS total_payment DECIMAL(10,2),
                ADD COLUMN IF NOT EXISTS escrow_status VARCHAR(20) DEFAULT 'pending',
                ADD COLUMN IF NOT EXISTS funds_locked_at TIMESTAMP,
                ADD COLUMN IF NOT EXISTS funds_released_at TIMESTAMP;
            """))
            conn.commit()
            print("✓ Escrow fields added to campaigns")
        except Exception as e:
            print(f"Note: {e}")
        
        # 3. Create platform_revenue table
        print("\n3. Creating platform_revenue table...")
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS platform_revenue (
                    id SERIAL PRIMARY KEY,
                    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
                    brand_fee DECIMAL(10,2) NOT NULL,
                    influencer_fee DECIMAL(10,2) NOT NULL,
                    total_fee DECIMAL(10,2) NOT NULL,
                    fee_type VARCHAR(20) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    notes TEXT
                );
            """))
            conn.commit()
            print("✓ Platform revenue table created")
        except Exception as e:
            print(f"Note: {e}")
        
        # 4. Create indexes for performance
        print("\n4. Creating indexes...")
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_campaigns_escrow_status 
                ON campaigns(escrow_status);
                
                CREATE INDEX IF NOT EXISTS idx_platform_revenue_campaign 
                ON platform_revenue(campaign_id);
                
                CREATE INDEX IF NOT EXISTS idx_platform_revenue_created 
                ON platform_revenue(created_at);
            """))
            conn.commit()
            print("✓ Indexes created")
        except Exception as e:
            print(f"Note: {e}")
        
        # 5. Update existing campaigns with default values
        print("\n5. Updating existing campaigns...")
        try:
            # Set budget_amount from budget_max for existing campaigns
            conn.execute(text("""
                UPDATE campaigns 
                SET budget_amount = budget_max,
                    escrow_status = 'pending'
                WHERE budget_amount IS NULL AND budget_max IS NOT NULL;
            """))
            conn.commit()
            print("✓ Existing campaigns updated")
        except Exception as e:
            print(f"Note: {e}")
        
        # 6. Verify migration
        print("\n6. Verifying migration...")
        
        # Check users table
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name IN ('wallet_balance', 'locked_balance');
        """))
        user_cols = [row[0] for row in result]
        print(f"   Users table columns: {user_cols}")
        
        # Check campaigns table
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'campaigns' 
            AND column_name IN ('budget_amount', 'brand_fee', 'influencer_fee', 'escrow_status');
        """))
        campaign_cols = [row[0] for row in result]
        print(f"   Campaigns table columns: {campaign_cols}")
        
        # Check platform_revenue table
        result = conn.execute(text("""
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_name = 'platform_revenue';
        """))
        revenue_exists = result.scalar() > 0
        print(f"   Platform revenue table exists: {revenue_exists}")
        
        print("\n" + "=" * 60)
        print("✅ Campaign Escrow Integration Migration Complete!")
        print("\nNext steps:")
        print("1. Update Campaign model with new fields")
        print("2. Create PlatformRevenue model")
        print("3. Update campaign creation logic")
        print("4. Update frontend to show fees and wallet")
        print("=" * 60)

if __name__ == "__main__":
    try:
        run_migration()
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        sys.exit(1)
