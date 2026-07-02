from database.connection import conn


def get_user(username):

    cur = conn.cursor()

    cur.execute("""
        SELECT
            u.user_id,
            u.username,
            u.password_hash,
            r.role_name
        FROM users u
        JOIN roles r
        ON u.role_id=r.role_id
        WHERE username=%s
        AND active=True
    """, (username,))

    row = cur.fetchone()

    cur.close()

    return row