import type { ProfileActivityStatus, ProfileLearningStats } from "../../Types/ProfileStatsTypes";
import { Badge, Card, Empty, formatDuration, formatShortDate, Meter, Row } from "./ProfileUI";

const statusTone = (s: ProfileActivityStatus) =>
    s === "completed" ? "good" : s === "in_progress" ? "warn" : "bad";
const statusLabel = (s: ProfileActivityStatus) =>
    s === "in_progress" ? "In progress" : s === "completed" ? "Completed" : "Abandoned";

const LearningActivity = ({ learning }: { learning: ProfileLearningStats }) => {
    const { quizzes: q, games: g, bestScores, recentActivity } = learning;

    return (
        <div className="flex w-full flex-col gap-4">
            <h2 className="text-[1.2em] font-[600] text-[#3E3025]">Learning activity</h2>

            <div className="grid gap-4 md:grid-cols-2">
                <Card title="Quizzes" subtitle="Your quiz performance">
                    <Meter label="Average score" value={q.averagePercentage} color="#B8893B" />
                    <div className="mt-3">
                        <Row label="Completed" value={q.completed} />
                        <Row label="Best score" value={`${Math.round(q.bestPercentage * 10) / 10}%`} />
                        <Row label="Time spent" value={formatDuration(q.totalTimeSeconds)} />
                        <Row label="In progress / abandoned" value={`${q.inProgress} / ${q.abandoned}`} />
                    </div>
                </Card>

                <Card title="Games" subtitle="Your historical challenges">
                    <Meter label="Answer accuracy" value={g.accuracy} color="#6B7A4F" />
                    <div className="mt-3">
                        <Row label="Games played" value={g.played} />
                        <Row label="Best score" value={g.bestScore} />
                        <Row label="Total points" value={g.totalPoints} />
                        <Row label="Correct / incorrect" value={`${g.correctAnswers} / ${g.incorrectAnswers}`} />
                        <Row label="Challenges completed" value={g.challengesCompleted} />
                    </div>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card title="Best quiz scores">
                    {bestScores.quizzes.length ? (
                        <ol className="divide-y divide-[#E7DFD0]">
                            {bestScores.quizzes.map((s, i) => (
                                <li key={s.id} className="flex items-center gap-3 py-2.5 text-[14px]">
                                    <span className="w-5 text-[#3E3025]/50">{i + 1}</span>
                                    <span className="min-w-0 flex-1 truncate font-[600] text-[#3E3025]">{s.title}</span>
                                    <span className="text-[#3E3025]/60">{s.score}/{s.maxScore}</span>
                                    <Badge tone="good">{Math.round(s.percentage)}%</Badge>
                                </li>
                            ))}
                        </ol>
                    ) : <Empty text="No completed quizzes yet" />}
                </Card>

                <Card title="Best game scores">
                    {bestScores.games.length ? (
                        <ol className="divide-y divide-[#E7DFD0]">
                            {bestScores.games.map((s, i) => (
                                <li key={s.id} className="flex items-center gap-3 py-2.5 text-[14px]">
                                    <span className="w-5 text-[#3E3025]/50">{i + 1}</span>
                                    <span className="min-w-0 flex-1 truncate font-[600] text-[#3E3025]">{s.title}</span>
                                    <span className="text-[#3E3025]/60">{s.score} pts</span>
                                    <Badge tone="good">{Math.round(s.accuracy)}%</Badge>
                                </li>
                            ))}
                        </ol>
                    ) : <Empty text="No completed games yet" />}
                </Card>
            </div>

            <Card title="Recent activity">
                {recentActivity.length ? (
                    <ul className="divide-y divide-[#E7DFD0]">
                        {recentActivity.map((a) => (
                            <li key={`${a.kind}-${a.id}`} className="flex items-center gap-3 py-2.5 text-[14px]">
                                <Badge tone="neutral">{a.kind === "quiz" ? "Quiz" : "Game"}</Badge>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-[600] text-[#3E3025]">{a.title}</p>
                                    <p className="text-[12px] text-[#3E3025]/50">{formatShortDate(a.date)}</p>
                                </div>
                                {a.status === "completed" && (
                                    <span className="text-[#3E3025]/70">
                                        {a.maxScore != null ? `${a.score}/${a.maxScore}` : `${a.score} pts`}
                                    </span>
                                )}
                                <Badge tone={statusTone(a.status)}>{statusLabel(a.status)}</Badge>
                            </li>
                        ))}
                    </ul>
                ) : <Empty text="No activity yet. Take a quiz or play a game to get started." />}
            </Card>
        </div>
    );
};

export default LearningActivity;