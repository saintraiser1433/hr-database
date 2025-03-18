import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignPeerEvaluations(academicYearId: number, departmentId: number, peersToEvaluate: number) {
    // Fetch all departments with their employees
    const departments = await prisma.departments.findMany({
        where: {
            id: departmentId,
        },
        include: {
            employees: true,
        },
    });

    // Create a set to track evaluated pairs for this academic year
    const evaluatedPairs = new Set<string>();

    for (const department of departments) {
        const employees = department.employees;

        for (const evaluator of employees) {
            // Get all peers except the evaluator
            const peers = employees.filter((emp) => emp.id !== evaluator.id);

            // Filter out peers that have already been evaluated by this evaluator in this academic year
            const availablePeers = peers.filter((peer) => {
                const pairKey = `${academicYearId}-${evaluator.id}-${peer.id}`;
                return !evaluatedPairs.has(pairKey);
            });

            // Randomly select peers
            const selectedPeers =
                availablePeers.length <= peersToEvaluate
                    ? availablePeers // Evaluate all available peers if there are not enough
                    : shuffleArray(availablePeers).slice(0, peersToEvaluate); // Randomly select peers

            // Create evaluation records
            for (const peer of selectedPeers) {
                await prisma.evaluation.create({
                    data: {
                        academicYearId,
                        evaluatorId: evaluator.id,
                        evaluateeId: peer.id,
                    },
                });

                // Mark this pair as evaluated for this academic year
                const pairKey = `${academicYearId}-${evaluator.id}-${peer.id}`;
                evaluatedPairs.add(pairKey);
            }
        }
    }

    console.log('Peer evaluations assigned successfully for academic year:', academicYearId);
}

// Helper function to shuffle an array
function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


assignPeerEvaluations(1, 1, 8)
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });