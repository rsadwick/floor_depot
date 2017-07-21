from mezzanine.conf import register_setting
from django.utils.translation import ugettext_lazy as _

register_setting(
    name="TEMPLATE_ACCESSIBLE_SETTINGS",
    description="Sequence of setting names available within templates.",
    editable=False,

    default=("COMPANY_PHONE", "SHOP_PRODUCT_SORTING"),
    append=True,
)

register_setting(
    name="COMPANY_PHONE",
    description="Company Phone Number",
    editable=True,
    label="Company Phone Number",
    default=("608.512.0176"),
)


register_setting(
    name="SHOP_PRODUCT_SORTING",
    description="Sequence of description/field+direction pairs defining "
                "the options available for sorting a list of products.",
    editable=False,
    default=(
        (_("Price (Low to High)"), "unit_price"),
        (_("Price (High to Low)"), "-unit_price"),
        (_("Newest to Oldest "), "-date_added"),
        (_("Oldest to Newest "), "date_added"),
    ),
)