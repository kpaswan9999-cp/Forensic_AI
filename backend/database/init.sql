-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    source VARCHAR(255),
    url TEXT,
    published_at TIMESTAMP,
    source_type VARCHAR(50),
    credibility_tier INTEGER DEFAULT 2,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id),
    claim_text TEXT NOT NULL,
    attributed_to VARCHAR(255),
    entities JSONB,
    temporal_reference VARCHAR(255),
    claim_type VARCHAR(50),
    is_verifiable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Verification Results table
CREATE TABLE IF NOT EXISTS verification_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES claims(id),
    verdict VARCHAR(50),
    credibility_score FLOAT,
    confidence FLOAT,
    supporting_evidence JSONB,
    contradicting_evidence JSONB,
    reasoning_chain JSONB,
    key_contradictions JSONB,
    source_analysis JSONB,
    temporal_analysis JSONB,
    summary TEXT,
    citations JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Investigations table
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    input_text TEXT,
    overall_score FLOAT,
    overall_verdict VARCHAR(50),
    claims_count INTEGER,
    risk_flags JSONB,
    report JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Source Credibility table
CREATE TABLE IF NOT EXISTS source_credibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) UNIQUE,
    credibility_score FLOAT,
    tier INTEGER,
    category VARCHAR(100),
    notes TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default credibility scores
INSERT INTO source_credibility (domain, credibility_score, tier, category) VALUES
    ('reuters.com', 0.95, 1, 'news_agency'),
    ('apnews.com', 0.94, 1, 'news_agency'),
    ('bbc.com', 0.92, 1, 'broadcaster'),
    ('who.int', 0.97, 1, 'official'),
    ('cdc.gov', 0.96, 1, 'government'),
    ('snopes.com', 0.88, 1, 'factcheck'),
    ('politifact.com', 0.85, 1, 'factcheck'),
    ('wikipedia.org', 0.78, 2, 'wiki'),
    ('twitter.com', 0.30, 3, 'social'),
    ('reddit.com', 0.25, 3, 'social')
ON CONFLICT (domain) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_claims_document_id ON claims(document_id);
CREATE INDEX IF NOT EXISTS idx_verification_claim_id ON verification_results(claim_id);
CREATE INDEX IF NOT EXISTS idx_investigations_status ON investigations(status);
CREATE INDEX IF NOT EXISTS idx_documents_source ON documents(source);
