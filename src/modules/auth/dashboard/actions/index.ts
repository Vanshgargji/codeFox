"use server";
// Remove the .ts extension
import { fetchUserContribution, getGithubAccessToken } from "@/modules/auth/github/lib/github";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Octokit } from "octokit";
import prisma from "@/lib/db";

export async function getDashboardStats() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const token = await getGithubAccessToken();
		const octokit = new Octokit({ auth: token });

		// Get users github username
		const { data: user } = await octokit.rest.users.getAuthenticated();

        if (!user?.login) {
          throw new Error("Could not retrieve GitHub username");
        }

        // TODO : Fetch total connected repo for db
        const totalRepos = 30;

        const calendar = await fetchUserContribution(token, user.login);
        const totalCommits = calendar?.totalContributions || 0;

        // Count prs from database or github
        const {data:prs} = await octokit.rest.search.issuesAndPullRequests({
            q:`author:${user.login} type:pr`,
            per_page:1
        });

        const totalPRs = prs.total_count || 0;

        // TODO Count ai reviews from database
        const totalReviews = 43;

        return {
            totalCommits,
            totalPRs,
            totalReviews,
            totalRepos
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalCommits: 0,
            totalPRs: 0,
            totalReviews: 0,
            totalRepos: 99
        }
    }
}

export async function getMonthlyActivity() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token })

    const { data: user } = await octokit.rest.users.getAuthenticated();

    const calendar = await fetchUserContribution(token, user.login);

    if(!calendar){
        return [];
    }

    const monthlyData: {
			[key: string]: {
				commits: number;
				prs: number;
				reviews: number;
			};
		} = {};

    const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

    // Initialize monthly data for the past 6 months
    const now = new Date();
		for (let i = 5; i >= 0; i--) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthKey = monthNames[date.getMonth()];
			monthlyData[monthKey] = {
				commits: 0,
				prs: 0,
				reviews: 0,
			};
		}

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
		calendar.weeks.forEach((week: any) => {       // eslint-disable-next-line @typescript-eslint/no-explicit-any
			week.contributionDays.forEach((day: any) => {
				const date = new Date(day.date);
				const monthKey = monthNames[date.getMonth()];
				if (monthlyData[monthKey]) {
					monthlyData[monthKey].commits += day.contributionCount;
				}
			});
		});

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // TODO reviews real data 

        const generateSampleReviews = () => {
            const sampleReviews = [];
            const now = new Date();

            // Generate random reviews over the past 6 months
            for (let i = 0; i < 45; i++) {
                const randomDaysAgo = Math.floor(Math.random() * 180); // Random day in last 6 months
                const reviewDate = new Date(now);
                reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

                sampleReviews.push({
                createdAt: reviewDate,
                });
            }

            return sampleReviews;
        };

        const reviews = generateSampleReviews();

        reviews.forEach((review) => {
			const monthKey = monthNames[review.createdAt.getMonth()];
			if (monthlyData[monthKey]) {
				monthlyData[monthKey].reviews += 1;
			}
		});

    // TODO prs real data

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${
        sixMonthsAgo.toISOString().split("T")[0]
      }`,
      per_page: 100,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey = monthNames[date.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    		return Object.keys(monthlyData).map((name) => ({
			name,
			...monthlyData[name],
		}));


  } catch (error) {
    // Error handling logic goes here
    console.error("Error fetching monthly activity:", error);
    return [];
  }
}

export async function getContributionStats() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const token = await getGithubAccessToken();
		const octokit = new Octokit({ auth: token });

		// Get the actual GitHub username from GitHub API
		const { data: user } = await octokit.rest.users.getAuthenticated();
		const username = user.login;

		const calender = await fetchUserContribution(token, username);

		if (!calender) {
			return null;
		}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
		const contributions = calender.weeks.flatMap((week: any) =>              // eslint-disable-next-line @typescript-eslint/no-explicit-any
			week.contributionDays.map((day: any) => ({
				date: day.date,
				count: day.contributionCount,
				level: Math.min(4, Math.floor(day.contributionCount / 3)),
			}))
		);

		return {
			contributions,
			totalContributions: calender.totalContributions,
		};
	} catch (error) {
		console.error("Error fetching contribution stats:", error);
		return null;
	}
}

