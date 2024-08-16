"use server";

import { getSession } from "@/utils/actions";
import prisma from "@/utils/connection";
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

export const createOrder = async (formData, cart) => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return { error: "User not found" };
  }

  const address = formData.get("address");
  const state = formData.get("state");
  const city = formData.get("city");
  const country = formData.get("country");
  const pincode = parseInt(formData.get("pinCode"));
  const PhoneNo = parseInt(formData.get("phoneNo"));

  if (!address || !state || !city || !country || !pincode || !PhoneNo) {
    return { error: "please fill all fields" };
  }

  try {
    const cartDetails = cart?.map((item) => {
      return {
        productId: item.product.id,
        quantity: item.quantity,
      };
    });
    console.log(cartDetails);

    const order = await prisma.order.create({
      data: {
        addressinfo: {
          create: { address, state, city, country, pincode, PhoneNo },
        },
        OrderItem: {
          create: cartDetails,
        },
      },
    });

    console.log(order);

    if (!order) {
      return { error: "order not created" };
    }

    const transformedItem = cart?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: transformedItem,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success/${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/cancel`,
    });
    console.log(stripeSession, "stripeSession");

    return { result: stripeSession.url };
  } catch (error) {
    return { error: "order not created" };
  }
};

export const confirmOrder = async (id) => {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return { error: "User not found" };
  }

  let order;
  try {
    order = await prisma.order.update({
      where: { id },
      data: { isPaid: true },
    });
    if (!order) {
      return { error: "order not udpated" };
    }
  } catch (error) {
    return { error: "order not udpated" };
  }
  return { result: order };
};