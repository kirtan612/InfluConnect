"""
Database migration script to add agreement and dispute columns to campaigns table.
Run this script to update your database schema for the agreement/dispute system.
"""
import sys
from sqlalchemy import text
from app.db.session import engine

def migrate_campaign_agreements():
    """Add agreement and dispute columns to campaigns table."""
    
    migrations = [
        # Add brand agreement columns
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS brand_accepted_terms BOOLEAN DEFAULT FALSE;
        """,
        
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS brand_accepted_at TIMESTAMP NULL;
        """,
        
        # Add influencer agreement columns
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS influencer_accepted_terms BOOLEAN DEFAULT FALSE;
        """,
        
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS influencer_accepted_at TIMESTAMP NULL;
        """,
        
        # Add dispute tracking columns
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS dispute_count INTEGER DEFAULT 0;
        """,
        
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS dispute_reason TEXT NULL;
        """,
        
        # Add admin decision columns
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS admin_decision VARCHAR(50) NULL;
        """,
        
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS admin_decided_at TIMESTAMP NULL;
        """,
        
        """
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS admin_decided_by INTEGER NULL;
        """,
        
        # Add foreign key constraint
        """
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint 
                WHERE conname = 'fk_campaigns_admin_decided_by'
            ) THEN
                ALTER TABLE campaigns 
                ADD CONSTRAINT fk_campaigns_admin_decided_by 
                FOREIGN KEY (admin_decided_by) REFERENCES users(id) ON DELETE SET NULL;
            END IF;
        END $$;
        """,
        
        # Update existing records with default values
        """
        UPDATE campaigns 
        SET 
            brand_accepted_terms = COALESCE(brand_accepted_terms, FALSE),
            influencer_accepted_terms = COALESCE(influencer_accepted_terms, FALSE),
            dispute_count = COALESCE(dispute_count, 0)
        WHERE brand_accepted_terms IS NULL 
           OR influencer_accepted_terms IS NULL 
           OR dispute_count IS NULL;
        """,
        
        # Create indexes
        """
        CREATE INDEX IF NOT EXISTS idx_campaigns_brand_accepted 
        ON campaigns(brand_accepted_terms);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_campaigns_influencer_accepted 
        ON campaigns(influencer_accepted_terms);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_campaigns_dispute_count 
        ON campaigns(dispute_count);
        """,
        
        """
        CREATE INDEX IF NOT EXISTS idx_campaigns_admin_decision 
        ON campaigns(admin_decision);
        """
    ]
    
    print("Starting campaign agreement/dispute migration...")
    print("=" * 70)
    
    try:
        with engine.connect() as connection:
            for i, migration in enumerate(migrations, 1):
                print(f"\nRunning migration {i}/{len(migrations)}...")
                migration_clean = migration.strip()
                
                # Show what we're doing
                if "ADD COLUMN" in migration_clean:
                    try:
                        column_name = migration_clean.split("ADD COLUMN IF NOT EXISTS ")[1].split(" ")[0]
                        print(f"  Adding column: {column_name}")
                    except:
                        print(f"  Adding column...")
                elif "ADD CONSTRAINT" in migration_clean:
                    print("  Adding foreign key constraint")
                elif "UPDATE" in migration_clean:
                    print("  Updating existing records with default values")
                elif "CREATE INDEX" in migration_clean:
                    try:
                        index_name = migration_clean.split("CREATE INDEX IF NOT EXISTS ")[1].split(" ")[0]
                        print(f"  Creating index: {index_name}")
                    except:
                        print(f"  Creating index...")
                
                connection.execute(text(migration_clean))
                connection.commit()
                
                print(f"  ✓ Migration {i} completed successfully")
        
        print("\n" + "=" * 70)
        print("✓ All migrations completed successfully!")
        print("\nVerifying database schema...")
        
        # Verify columns exist
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'campaigns'
                AND column_name IN (
                    'brand_accepted_terms', 
                    'brand_accepted_at',
                    'influencer_accepted_terms',
                    'influencer_accepted_at',
                    'dispute_count',
                    'dispute_reason',
                    'admin_decision',
                    'admin_decided_at',
                    'admin_decided_by'
                )
                ORDER BY column_name;
            """))
            
            print("\nAgreement/Dispute columns in campaigns table:")
            print("-" * 70)
            
            columns_found = []
            for row in result:
                column_name = row[0]
                data_type = row[1]
                nullable = row[2]
                default = row[3] or 'None'
                columns_found.append(column_name)
                print(f"  ✓ {column_name:<30} {data_type:<15} Nullable: {nullable:<3} Default: {default}")
            
            # Check if all required columns exist
            required_columns = [
                'brand_accepted_terms', 'brand_accepted_at',
                'influencer_accepted_terms', 'influencer_accepted_at',
                'dispute_count', 'dispute_reason',
                'admin_decision', 'admin_decided_at', 'admin_decided_by'
            ]
            
            missing = [col for col in required_columns if col not in columns_found]
            if missing:
                print(f"\n⚠ Warning: Missing columns: {', '.join(missing)}")
            else:
                print(f"\n✓ All {len(required_columns)} required columns exist!")
        
        # Check indexes
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT indexname 
                FROM pg_indexes 
                WHERE tablename = 'campaigns' 
                AND indexname LIKE 'idx_campaigns_%'
                ORDER BY indexname;
            """))
            
            indexes = [row[0] for row in result]
            print(f"\nIndexes created: {len(indexes)}")
            for idx in indexes:
                if any(x in idx for x in ['brand_accepted', 'influencer_accepted', 'dispute', 'admin_decision']):
                    print(f"  📊 {idx}")
        
        print("\n✓ Campaign agreement/dispute migration completed successfully!")
        print("\n🚀 Your campaigns table is now ready for the agreement/dispute system!")
        print("\nNext steps:")
        print("  1. Restart your FastAPI server")
        print("  2. Test the campaign endpoints")
        print("  3. Check the admin dashboard for agreement management")
        
        return True
        
    except Exception as e:
        print(f"\n✗ Migration failed: {str(e)}")
        print("\nTroubleshooting:")
        print("  1. Make sure your database is running")
        print("  2. Check your .env file for correct database credentials")
        print("  3. Ensure you have the required permissions")
        print("\nManual migration option:")
        print("  Run the SQL file manually:")
        print("    psql -U postgres -d influconnect -f add_campaign_agreement_columns.sql")
        return False

if __name__ == "__main__":
    success = migrate_campaign_agreements()
    sys.exit(0 if success else 1)
