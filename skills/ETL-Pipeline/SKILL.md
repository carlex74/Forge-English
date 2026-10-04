---
name: ETL-Pipeline
description: How to implement a ETL pipeline in a python project using the best practice and patterns.
---

# ETL Pipeline Implementation Guide

This skill provides best practices and patterns for implementing an Extract, Transform, Load (ETL) pipeline in a Python project. Follow these guidelines to ensure your data pipelines are robust, scalable, and maintainable.

## 1. Project Structure
Organize your ETL project with a clear separation of concerns:

```
project_root/
├── extractors/       # Modules for data extraction (APIs, databases, files)
├── transformers/     # Modules for data cleaning and transformation
├── loaders/          # Modules for loading data into the destination
├── models/           # Data models/schemas (e.g., Pydantic, SQLAlchemy)
├── utils/            # Helper functions (logging, connections)
├── pipelines/        # Orchestration of the E, T, and L steps
└── main.py           # Entry point
```

## 2. Best Practices

### Extract (Data Ingestion)
- **Idempotency:** Ensure that running the extraction multiple times with the same parameters yields the same results.
- **Incremental Extraction:** Whenever possible, use watermarks (e.g., updated_at timestamps) to extract only new or modified data.
- **Resilience:** Implement retry mechanisms with exponential backoff for external API calls or database connections (use libraries like `tenacity`).

### Transform (Data Processing)
- **Stateless Transformations:** Keep transformation functions pure. They should take data as input and return transformed data without side effects.
- **Validation:** Validate data early using tools like `Pydantic` or `Great Expectations` to catch anomalies before loading.
- **Vectorization:** Use `pandas` or `polars` for in-memory transformations to leverage vectorized operations instead of iterating over rows.
- **Chunking:** For large datasets, process data in chunks or streams to avoid memory exhaustion.

### Load (Data Storage)
- **Upserts:** Prefer UPSERT (Insert or Update) operations over simple INSERTS to handle duplicate records gracefully.
- **Atomic Operations:** Use transactions. If a load fails halfway, the database should rollback to prevent partial data states.
- **Bulk Loading:** Use bulk insert operations provided by your database driver (e.g., `executemany` or specific COPY commands) for better performance.

## 3. Recommended Libraries
- **Orchestration:** Airflow, Prefect, Dagster (for complex DAGs)
- **Data Processing:** Pandas, Polars, PySpark (for distributed processing)
- **Validation:** Pydantic, Pandera
- **Retries:** Tenacity
- **Database/ORM:** SQLAlchemy, SQLModel

## 4. Code Pattern Example

Here is a simplified pattern for an ETL pipeline:

```python
import logging
from extractors import extract_data
from transformers import transform_data
from loaders import load_data

logger = logging.getLogger(__name__)

def run_pipeline(source_config: dict, dest_config: dict):
    try:
        logger.info("Starting extraction...")
        raw_data = extract_data(source_config)
        
        logger.info("Starting transformation...")
        clean_data = transform_data(raw_data)
        
        logger.info("Starting load...")
        load_data(clean_data, dest_config)
        
        logger.info("Pipeline completed successfully.")
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        raise
```

## 5. Logging and Monitoring
- Implement structured logging. Include metadata like `pipeline_run_id`, `source`, and `timestamp`.
- Track metrics such as rows extracted, rows transformed, and rows loaded.
- Alert on failures and significant drops in data volume.
