from app.extensions import db


class Tourism(db.Model):
    __tablename__ = "tourism"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    city_id = db.Column(
        db.Integer,
        db.ForeignKey("cities.id"),
        nullable=False,
        index=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    category = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    address = db.Column(
        db.String(255)
    )

    image = db.Column(
        db.String(255)
    )

    gallery = db.Column(
        db.JSON
    )

    latitude = db.Column(
        db.Float
    )

    longitude = db.Column(
        db.Float
    )

    opening_hours = db.Column(
        db.String(255)
    )

    ticket_price = db.Column(
        db.Float
    )

    rating = db.Column(
        db.Float,
        default=0
    )

    verified = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )


    # العلاقة مع المدينة
    city = db.relationship(
        "City",
        back_populates="tourism_places"
    )


    def __repr__(self):
        return f"<Tourism {self.name}>"


    def to_dict(self):
        return {
            "id": self.id,
            "city_id": self.city_id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "address": self.address,
            "image": self.image,
            "gallery": self.gallery,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "opening_hours": self.opening_hours,
            "ticket_price": self.ticket_price,
            "rating": self.rating,
            "verified": self.verified,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
