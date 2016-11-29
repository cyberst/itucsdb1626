#!/usr/bin/env python3
import foodle
import psycopg2
from psycopg2.extras import DictCursor
from flask import Blueprint, render_template, current_app, request, redirect

posts_controller = Blueprint('posts_controller', __name__)


@posts_controller.route('/', methods=['POST'])
def create():
    if not isinstance(request.json.get('body'), str) or not isinstance(request.json.get('user_id'), int):
        return "Request body is unprocessable.", 422

    with psycopg2.connect(foodle.app.config['dsn']) as conn:
        with conn.cursor(cursor_factory=DictCursor) as curs:
            curs.execute(
            """
            INSERT INTO posts
            (title, body, cost, score, user_id, place_id)
            VALUES (%(title)s, %(body)s, %(cost)s, %(score)s, %(user_id)s, %(place_id)s)
            RETURNING *
            """, request.json)

            if curs.rowcount is not 0:
                return "Created.", 201
            else:
                return "Entity not found.", 404


@posts_controller.route('/<int:id>', methods=['PUT', 'PATCH'])
def update(id):
    if request.json.get('id') is not None:
        return "Request body is unprocessable.", 422

    request.json['id'] = id

    with psycopg2.connect(foodle.app.config['dsn']) as conn:
        with conn.cursor(cursor_factory=DictCursor) as curs:
            curs.execute(
            """
            UPDATE posts
            SET title = %(title)s,
                body = %(body)s,
                cost = %(cost)s,
                score = %(score)s
            WHERE id = %(id)s
            RETURNING *
            """, request.json)

            if curs.rowcount is not 0:
                return render_template('/posts/show.html', post=curs.fetchone())
            else:
                return "Entity not found.", 404


@posts_controller.route('/<int:id>/edit', methods=['GET'])
def edit(id):
    with psycopg2.connect(foodle.app.config['dsn']) as conn:
        with conn.cursor(cursor_factory=DictCursor) as curs:
            curs.execute(
            """
            SELECT p.id post_id,
                   p.body,
                   p.title,
                   p.cost,
                   p.score,
                   p.inserted_at,
                   u.id user_id,
                   u.display_name,
                   u.username,
                   pl.id place_id,
                   pl.name place_name
            FROM posts p
            INNER JOIN users u ON u.id = p.user_id
            INNER JOIN places pl ON pl.id = p.place_id
            WHERE p.id = %s
            """,
            [id])

            post = curs.fetchone()

            curs.execute(
            """
            SELECT link
            FROM post_images pi
            WHERE pi.post_id = %s
            """,
            [id])

            post_image_urls = curs.fetchall()

            if post is not None:
                return render_template('/posts/edit.html', post=post, post_image_urls=post_image_urls)
            else:
                return "Entity not found.", 404


@posts_controller.route('/<int:id>', methods=['DELETE'])
def delete(id):
    with psycopg2.connect(foodle.app.config['dsn']) as conn:
        with conn.cursor(cursor_factory=DictCursor) as curs:
            curs.execute(
            """
            DELETE FROM posts
            WHERE id = %s
            """, [id])

            if curs.rowcount is not 0:
                return "", 204
            else:
                return "Entity not found.", 404
