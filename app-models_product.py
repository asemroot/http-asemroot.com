from app.extensions import db


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    business_id = db.Column(
        db.Integer,
        db.ForeignKey("businesses.id"),
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

    description = db.Column(db.Text)

    price = db.Column(db.Float)

    currency = db.Column(
        db.String(20),
        default="USD"
    )

    image = db.Column(db.String(255))

    gallery = db.Column(db.JSON)

    stock = db.Column(
        db.Integer,
        default=0
    )

    sku = db.Column(
        db.String(100),
        unique=True
    )

    rating = db.Column(
        db.Float,
        default=0
    )

    is_available = db.Column(
        db.Boolean,
        default=True,
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

    # العلاقة مع النشاط التجاري
    business = db.relationship(
        "Business",
        back_populates="products"
    )

    def __repr__(self):
        return f"<Product {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "business_id": self.business_id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "price": self.price,
            "currency": self.currency,
            "image": self.image,
            "gallery": self.gallery,
            "stock": self.stock,
            "sku": self.sku,
            "rating": self.rating,
            "is_available": self.is_available,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
