"""
Migration script for escrow system tables.
"""
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add app to path
sys.path.append('.')

from app.core.config import settings
from app.db.base import Base
from app.db.models.wallet import Wallet
from app.db.models.transaction import Transaction

print("[DEBUG] SECRET_KEY loaded:", settings.SECRET_KEY[:10] + "... (length: {})".format(len(settings.SECRET_KEY)))
print("[DEBUG] ALGORITHM:", settings.ALGORITHM)
print("[DEBUG] DATABASE_URL:", settings.DATABASE_URL[:30] + "...")

# Create engine
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def run_migration():
    """Run escrow system migrations."""
    print("\nStarting escrow system migration...")
    print("=" * 70)
    
    migrations = [
        {
            "name": "Creating wallets table",
            "sql": """
                CREATE TABLE IF NOT EXISTS wallets (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    wallet_balance FLOAT DEFAULT 0.0 NOT NULL,
                    locked_balance FLOAT DEFAULT 0.0 NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """
        },
        {
            "name": "Creating transactions table",
            "sql": """
                CREATE TABLE IF NOT EXISTS transactions (
                    id SERIAL PRIMARY KEY,
                    buyer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    seller_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    amount FLOAT NOT NULL,
                    status VARCHAR(50) DEFAULT 'held' NOT NULL,
                    agreement_status VARCHAR(50) DEFAULT 'pending' NOT NULL,
                    buyer_accepted INTEGER DEFAULT 0 NOT NULL,
                    seller_accepted INTEGER DEFAULT 0 NOT NULL,
                    buyer_accepted_at TIMESTAMP,
                    seller_accepted_at TIMESTAMP,
                    dispute_count INTEGER DEFAULT 0 NOT NULL,
                    dispute_status VARCHAR(50),
                    dispute_reason TEXT,
                    dispute_raised_by INTEGER REFERENCES users(id),
                    dispute_raised_at TIMESTAMP,
                    admin_resolved_by INTEGER REFERENCES users(id),
                    admin_resolved_at TIMESTAMP,
                    admin_notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """
        },
        {
            "name": "Creating index: idx_wallets_user_id",
            "sql": "CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);"
        },
        {
            "name": "Creating index: idx_transactions_buyer_id",
            "sql": "CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);"
        },
        {
            "name": "Creating index: idx_transactions_seller_id",
            "sql": "CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);"
        },
        {
            "name": "Creating index: idx_transactions_status",
            "sql": "CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);"
        }
    ]
    
    db = SessionLocal()
    
    try:
        for i, migration in enumerate(migrations, 1):
            print(f"\nRunning migration {i}/{len(migrations)}...")
            print(f"{migration['name']}")
            
            try:
                db.execute(text(migration['sql']))
                db.commit()
                print(f"✓ Migration {i} completed successfully")
            except Exception as e:
                print(f"✗ Migration failed: {e}")
                db.rollback()
                print("\nTroubleshooting:")
                print("1. Make sure your database is running")
                print("2. Check your .env file for correct database credentials")
                print("3. Ensure you have the required permissions")
                print("\nIf the table already exists, this is normal and you can ignore this error.")
                continue
        
        print("\n" + "=" * 70)
        print("✓ Escrow system migration completed!")
        print("\nNext steps:")
        print("1. Restart your FastAPI server")
        print("2. Test wallet endpoints: GET /api/escrow/wallet")
        print("3. Add demo funds: POST /api/escrow/wallet/add-funds")
        print("4. Create transactions: POST /api/escrow/transactions")
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    run_migration()
