import { TemplateDetail, TemplateHeader } from "@prisma/client";
import prisma from "../prisma/index.ts";

export const getAllTemplateHeader = async () => {
  try {
    const response = await prisma.templateHeader.findMany({
      select: {
        id: true,
        template_name: true,
        description: true,
      },
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const createTemplateHeader = async (data: TemplateHeader) => {
  try {
    const response = await prisma.templateHeader.create({
      data,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateTemplateHeader = async (
  id: number,
  data: TemplateHeader
) => {
  return await prisma.templateHeader.update({
    where: {
      id: id,
    },
    data,
  });
};

export const removeTemplateHeader = async (id: number) => {
  return await prisma.templateHeader.delete({
    where: {
      id: id,
    },
  });
};

//end header

export const getAllTemplateDetail = async (id: number) => {
  try {
    const response = await prisma.templateDetail.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        score: true,
      },
      where: {
        templateId: id,
      },
      orderBy: {
        score: "desc",
      },
    });

    return response;
  } catch (err) {
    throw err;
  }
};

export const createTemplateDetail = async (data: TemplateDetail) => {
  try {
    const response = await prisma.templateDetail.create({
      data,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const updateTemplateDetail = async (
  id: number,
  data: TemplateDetail
) => {
  return await prisma.templateDetail.update({
    where: {
      id: id,
    },
    data,
  });
};

export const removeTemplateDetail = async (id: number) => {
  return await prisma.templateDetail.delete({
    where: {
      id: id,
    },
  });
};
