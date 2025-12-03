from database.config import get_db_connection
from psycopg2.extras import RealDictCursor
import psycopg2


def add_card_content(card_id: int, content_html: str = None, due_date: str = None):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # INSERT part must always supply all required columns
        insert_query = """
            INSERT INTO card_contents (card_id, content_html, due_date)
            VALUES (%s, %s, %s)
            ON CONFLICT (card_id)
            DO UPDATE SET 
                content_html = COALESCE(EXCLUDED.content_html, card_contents.content_html),
                due_date = EXCLUDED.due_date,
                updated_at = CURRENT_TIMESTAMP
            RETURNING card_id, content_html, due_date, updated_at;
        """

        # Always provide all 3 values (Postgres requires this)
        cur.execute(insert_query, (card_id, content_html, due_date))

        new_content = cur.fetchone()
        conn.commit()

        return {
            "message": "Card content updated successfully",
            "content": new_content
        }, 201

    except psycopg2.Error as e:
        conn.rollback()
        return {"error": f"Database error: {e.pgerror or str(e)}"}, 400

    finally:
        cur.close()
        conn.close()


def get_card_content(card_id: int):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute("""
            SELECT card_id, content_html, updated_at, due_date
            FROM card_contents
            WHERE card_id = %s
        """, (card_id,))
        content = cur.fetchone()

        # ✅ Return 200 even if there's no content
        if not content:
            return {"message": "No content yet", "content": None}, 200

        return {"content": content}, 200

    except psycopg2.Error as e:
        return {"error": f"Database error: {e.pgerror or str(e)}"}, 400

    finally:
        cur.close()
        conn.close()



def add_comment(card_id: int, user_id: int, comment: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute("""
            INSERT INTO card_comments (card_id, user_id, comment)
            VALUES (%s, %s, %s)
            RETURNING id, card_id, user_id, comment, created_at;
        """, (card_id, user_id, comment))

        new_comment = cur.fetchone()
        conn.commit()

        return {
            "message": "Comment added successfully",
            "comment": new_comment
        }, 201

    except psycopg2.Error as e:
        conn.rollback()
        return {
            "error": f"Database error: {e.pgerror or str(e)}"
        }, 400

    finally:
        cur.close()
        conn.close()


def delete_comment(comment_id: int):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute("""
            DELETE FROM card_comments
            WHERE id = %s
            RETURNING id;
        """, (comment_id,))

        deleted = cur.fetchone()

        if not deleted:
            return {"error": "Comment not found"}, 404

        conn.commit()

        return {"message": "Comment deleted successfully"}, 200

    except psycopg2.Error as e:
        conn.rollback()
        return {
            "error": f"Database error: {e.pgerror or str(e)}"
        }, 400

    finally:
        cur.close()
        conn.close()


def get_comments(card_id: int):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute("""
            SELECT id, card_id, user_id, comment, created_at
            FROM card_comments
            WHERE card_id = %s
            ORDER BY created_at ASC;
        """, (card_id,))

        comments = cur.fetchall()
        conn.commit()

        return {"comments": comments}, 200

    except psycopg2.Error as e:
        conn.rollback()
        return {"error": f"Database error: {e.pgerror or str(e)}"}, 400

    finally:
        cur.close()
        conn.close()
