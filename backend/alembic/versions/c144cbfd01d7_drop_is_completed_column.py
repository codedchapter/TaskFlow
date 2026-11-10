"""drop is_completed column

Revision ID: c144cbfd01d7
Revises: a6090e6a745d
Create Date: 2026-11-10 21:01:02.651017

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'c144cbfd01d7'
down_revision: Union[str, Sequence[str], None] = 'a6090e6a745d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # The 'status' column and index already exist in the database.
    # We ONLY need to drop the old columns that are causing the crash.

    try:
        op.drop_column('tasks', 'is_completed')
    except Exception:
        pass # Ignore if it's already gone

    try:
        op.drop_column('tasks', 'completed_at')
    except Exception:
        pass # Ignore if it's already gone



def downgrade() -> None:
    """Downgrade schema."""
    op.add_column('tasks', sa.Column('is_completed', sa.Boolean(), nullable=True))
    op.add_column('tasks', sa.Column('completed_at', sa.DateTime(), nullable=True))
