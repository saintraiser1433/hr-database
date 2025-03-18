import prisma from "./index.ts";

async function viewEvaluations() {
    const evaluations = await prisma.evaluation.findMany({
        include: {
            evaluator: true,
            evaluatee: true,
        },
    });

    console.log('Evaluations:');
    evaluations.forEach((eval:) => {
        console.log(`${eval.evaluator.id} will evaluate ${eval.evaluatee.id}`);
    });
}

viewEvaluations()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });