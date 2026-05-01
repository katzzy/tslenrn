import { runProcess } from './processRunner';

export class DockerAvailabilityProbe {
  private dockerAvailableCache: boolean | null = null;

  async isDockerAvailable(): Promise<boolean> {
    if (this.dockerAvailableCache !== null) {
      return this.dockerAvailableCache;
    }

    try {
      const result = await runProcess('docker', ['version', '--format', '{{.Server.Version}}'], {
        timeout: 3000,
        maxOutputLength: 2000,
      });
      this.dockerAvailableCache = result.exitCode === 0;
    } catch {
      this.dockerAvailableCache = false;
    }

    return this.dockerAvailableCache;
  }
}
