"""
Migration script to create collaborations table.
Run this to add the new collaboration lifecycle system.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_collaborations():
    """Create collaborations table and migrate existing data."""
    engine = create_engine(settings.DATABASE_URL)
    
    print("\n" + "="*60)
    print("COLLABORATION LIFECYCLE MIGRATION")
    print("="*60)
    
    with engine.connect() as conn:
        # Create collaborations table
        print("\n1. Creating collaborations table...")
        
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS collaborations (
            id SERIAL PRIMARY KEY,
            request_id INTEGER NOT NULL UNIQUE REFERENCES collaboration_requests(id),
            campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
            influencer_id INTEGER NOT NULL REFERENCES influencer_profiles(id),
            brand_id INTEGER NOT NULL REFERENCES brand_profiles(id),
            status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
            payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
            deliverables JSONB DEFAULT '{}',
            content_links JSONB DEFAULT '[]',
            deadline TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP
        );
        """
        
        conn.execute(text(create_table_sql))
        conn.commit()
        print("✓ Collaborations table created")
        
        # Create indexes
        print("\n2. Creating indexes...")
        
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_collaborations_request_id ON collaborations(request_id);",
            "CREATE INDEX IF NOT EXISTS idx_collaborations_campaign_id ON collaborations(campaign_id);",
            "CREATE INDEX IF NOT EXISTS idx_collaborations_influencer_id ON collaborations(influencer_id);",
            "CREATE INDEX IF NOT EXISTS idx_collaborations_brand_id ON collaborations(brand_id);",
            "CREATE INDEX IF NOT EXISTS idx_collaborations_status ON collaborations(status);"
        ]
        
        for index_sql in indexes:
            conn.execute(text(index_sql))
        
        conn.commit()
        print("✓ Indexes created")
        
        # Migrate existing accepted requests to collaborations
        print("\n3. Migrating existing accepted requests...")
        
        migrate_sql = """
        INSERT INTO collaborations (
            request_id, campaign_id, influencer_id, brand_id, 
            status, payment_status, created_at, updated_at
        )
        SELECT 
            cr.id,
            cr.campaign_id,
            cr.influencer_id,
            c.brand_id,
            'ACTIVE',
            'PENDING',
            cr.updated_at,
            cr.updated_at
        FROM collaboration_requests cr
        JOIN campaigns c ON cr.campaign_id = c.id
        WHERE cr.status::text = 'accepted'
        AND NOT EXISTS (
            SELECT 1 FROM collaborations WHERE request_id = cr.id
        );
        """
        
        result = conn.execute(text(migrate_sql))
        conn.commit()
        
        migrated_count = result.rowcount
        print(f"✓ Migrated {migrated_count} existing accepted requests to collaborations")
        
        # Verify migration
        print("\n4. Verifying migration...")
        
        verify_sql = """
        SELECT 
            COUNT(*) as total_collaborations,
            COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active,
            COUNT(CASE WHEN payment_status = 'PENDING' THEN 1 END) as pending_payment
        FROM collaborations;
        """
        
        result = conn.execute(text(verify_sql))
        row = result.fetchone()
        
        print(f"✓ Total collaborations: {row[0]}")
        print(f"✓ Active collaborations: {row[1]}")
        print(f"✓ Pending payments: {row[2]}")
    
    print("\n" + "="*60)
    print("MIGRATION COMPLETE")
    print("="*60)
    print("\nNext steps:")
    print("1. Restart backend server")
    print("2. Test collaboration endpoints:")
    print("   - GET /api/collaboration")
    print("   - PUT /api/collaboration/{id}/deliverables")
    print("   - POST /api/collaboration/{id}/submit")
    print("   - PUT /api/collaboration/{id}/approve")
    print("   - PUT /api/collaboration/{id}/complete")
    print("\n" + "="*60)


if __name__ == "__main__":
    try:
        migrate_collaborations()
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        import traceback
        traceback.print_exc()
