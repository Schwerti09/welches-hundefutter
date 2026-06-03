import { ExecutionPipeline, PipelineStage, ExecutionMode } from "../types";

export class ExecutionPipelineSystem {
  private pipelines: Map<string, ExecutionPipeline> = new Map();
  private dependencyGraph: Map<string, string[]> = new Map();

  createPipeline(pipelineName: string, executionMode: ExecutionMode, stages: PipelineStage[], dependencies: string[]): ExecutionPipeline {
    const pipeline: ExecutionPipeline = {
      pipelineId: `pipeline-${pipelineName}-${Date.now()}`,
      pipelineName,
      executionMode,
      stages,
      dependencies,
      status: "pending",
      startedAt: 0,
      retryCount: 0,
      metadata: {},
    };

    this.pipelines.set(pipeline.pipelineId, pipeline);
    this.dependencyGraph.set(pipeline.pipelineId, dependencies);

    return pipeline;
  }

  executePipeline(pipelineId: string): ExecutionPipeline {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline ${pipelineId} not found`);
    }

    if (!this.checkDependencies(pipelineId)) {
      pipeline.status = "failed";
      return pipeline;
    }

    pipeline.status = "running";
    pipeline.startedAt = Date.now();

    this.executeStages(pipeline);

    pipeline.status = "completed";
    pipeline.completedAt = Date.now();

    return pipeline;
  }

  retryPipeline(pipelineId: string): ExecutionPipeline {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline ${pipelineId} not found`);
    }

    pipeline.status = "retrying";
    pipeline.retryCount++;

    return this.executePipeline(pipelineId);
  }

  getPipeline(pipelineId: string): ExecutionPipeline | undefined {
    return this.pipelines.get(pipelineId);
  }

  getPipelinesByStatus(status: ExecutionPipeline["status"]): ExecutionPipeline[] {
    return Array.from(this.pipelines.values()).filter((p) => p.status === status);
  }

  getPipelinesByExecutionMode(executionMode: ExecutionMode): ExecutionPipeline[] {
    return Array.from(this.pipelines.values()).filter((p) => p.executionMode === executionMode);
  }

  private checkDependencies(pipelineId: string): boolean {
    const dependencies = this.dependencyGraph.get(pipelineId) || [];

    for (const depId of dependencies) {
      const depPipeline = this.pipelines.get(depId);
      if (!depPipeline || depPipeline.status !== "completed") {
        return false;
      }
    }

    return true;
  }

  private executeStages(pipeline: ExecutionPipeline): void {
    for (const stage of pipeline.stages) {
      this.executeStage(stage);
    }
  }

  private executeStage(stage: PipelineStage): void {
    // Placeholder for stage execution
  }
}
