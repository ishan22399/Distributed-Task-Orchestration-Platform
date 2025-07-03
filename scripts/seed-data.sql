-- Seed data for TaskFlow Platform
-- Sample data for development and demonstration

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'alex.chen@taskflow.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'Alex', 'Chen', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'sarah.kim@taskflow.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'Sarah', 'Kim', 'user'),
('550e8400-e29b-41d4-a716-446655440003', 'mike.chen@taskflow.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'Mike', 'Chen', 'user'),
('550e8400-e29b-41d4-a716-446655440004', 'emma.davis@taskflow.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJBzxqEyy', 'Emma', 'Davis', 'user');

-- Insert sample teams
INSERT INTO teams (id, name, description, plan) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'TaskFlow Platform', 'Main platform development team', 'enterprise'),
('660e8400-e29b-41d4-a716-446655440002', 'Data Engineering', 'Data pipeline and ETL team', 'pro'),
('660e8400-e29b-41d4-a716-446655440003', 'ML Operations', 'Machine learning and AI team', 'pro');

-- Insert team memberships
INSERT INTO team_members (team_id, user_id, role) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'owner'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'owner'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'owner'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'member');

-- Insert sample workflows
INSERT INTO workflows (id, name, description, team_id, created_by, definition, schedule_expression, is_active) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'ETL Data Pipeline', 'Extract, transform, and load customer data from multiple sources', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 
'{"tasks": [{"id": "extract", "type": "python_script", "script": "extract_data.py"}, {"id": "transform", "type": "python_script", "script": "transform_data.py", "depends_on": ["extract"]}, {"id": "load", "type": "sql_query", "query": "INSERT INTO...", "depends_on": ["transform"]}]}', 
'0 2 * * *', true),

('770e8400-e29b-41d4-a716-446655440002', 'ML Model Training', 'Train and validate machine learning models for recommendation system', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003',
'{"tasks": [{"id": "prepare_data", "type": "python_script", "script": "prepare_training_data.py"}, {"id": "train_model", "type": "python_script", "script": "train_model.py", "depends_on": ["prepare_data"]}, {"id": "validate_model", "type": "python_script", "script": "validate_model.py", "depends_on": ["train_model"]}]}',
'0 10 * * 0', true),

('770e8400-e29b-41d4-a716-446655440003', 'Report Generation', 'Generate daily business intelligence reports and dashboards', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001',
'{"tasks": [{"id": "collect_metrics", "type": "sql_query", "query": "SELECT * FROM metrics..."}, {"id": "generate_report", "type": "python_script", "script": "generate_report.py", "depends_on": ["collect_metrics"]}, {"id": "send_email", "type": "email", "template": "daily_report", "depends_on": ["generate_report"]}]}',
'0 6 * * *', false),

('770e8400-e29b-41d4-a716-446655440004', 'Data Backup', 'Backup critical databases and file systems to cloud storage', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004',
'{"tasks": [{"id": "backup_db", "type": "shell_command", "command": "pg_dump..."}, {"id": "backup_files", "type": "shell_command", "command": "rsync..."}, {"id": "upload_to_s3", "type": "aws_s3", "bucket": "backups", "depends_on": ["backup_db", "backup_files"]}]}',
'0 */6 * * *', true);

-- Insert sample worker nodes
INSERT INTO worker_nodes (id, name, region, instance_type, status, capabilities, max_concurrent_tasks) VALUES
('worker-node-01', 'Primary Worker 01', 'us-east-1', 'c5.2xlarge', 'healthy', '{"task_types": ["python_script", "sql_query", "shell_command"], "cpu_cores": 8, "memory_gb": 16}', 5),
('worker-node-02', 'Primary Worker 02', 'us-east-1', 'c5.2xlarge', 'healthy', '{"task_types": ["python_script", "sql_query", "shell_command"], "cpu_cores": 8, "memory_gb": 16}', 5),
('worker-node-03', 'ML Worker 01', 'us-west-2', 'p3.2xlarge', 'warning', '{"task_types": ["python_script", "ml_training"], "cpu_cores": 8, "memory_gb": 61, "gpu": true}', 3),
('worker-node-04', 'Backup Worker 01', 'us-west-2', 'c5.xlarge', 'healthy', '{"task_types": ["shell_command", "aws_s3"], "cpu_cores": 4, "memory_gb": 8}', 3);

-- Insert sample workflow executions
INSERT INTO workflow_executions (id, workflow_id, status, started_at, completed_at, trigger_type) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'completed', '2024-01-15 02:00:00', '2024-01-15 02:05:23', 'scheduled'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'completed', '2024-01-14 10:00:00', '2024-01-14 10:45:12', 'scheduled'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', 'running', '2024-01-15 12:00:00', NULL, 'scheduled');

-- Insert sample system metrics
INSERT INTO system_metrics (metric_name, metric_value, unit, source, tags) VALUES
('cpu_usage_percent', 68.5, '%', 'worker-node-01', '{"component": "worker"}'),
('memory_usage_percent', 45.2, '%', 'worker-node-01', '{"component": "worker"}'),
('disk_usage_percent', 32.1, '%', 'worker-node-01', '{"component": "worker"}'),
('network_io_gbps', 1.2, 'Gbps', 'worker-node-01', '{"component": "worker"}'),
('active_tasks', 3, 'count', 'worker-node-01', '{"component": "worker"}'),
('queue_depth', 89, 'count', 'system', '{"component": "scheduler"}'),
('throughput_per_minute', 342, 'tasks/min', 'system', '{"component": "scheduler"}');
