"""add priority and due_date to tasks

Revision ID: de32ce45e51c
Revises: 94aafa57aa46
Create Date: 2026-11-18 16:57:39.260431

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'de32ce45e51c'
down_revision: Union[str, Sequence[str], None] = '94aafa57aa46'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column('tasks', sa.Column('priority', sa.String(length=10), nullable=False, server_default='medium'))
    op.add_column('tasks', sa.Column('due_date', sa.DateTime(), nullable=True))
    op.create_index(op.f('ix_tasks_priority'), 'tasks', ['priority'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_tasks_priority'), table_name='tasks')
    op.drop_column('tasks', 'due_date')
    op.drop_column('tasks', 'priority')
