export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class InvalidDataException extends DomainException {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issues: any[];
  constructor(
    message: string = 'Os dados fornecidos no corpo da requisição são inválidos',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    issues: any[] = []
  ) {
    super(message);
    this.name = 'InvalidDataException';
    this.issues = issues;
  }
}

export class DriverNotFoundException extends DomainException {
  constructor(message: string = 'Motorista não encontrado') {
    super(message);
    this.name = 'DriverNotFoundException';
  }
}

export class InvalidDistanceException extends DomainException {
  constructor(message: string = 'Quilometragem inválida para o motorista') {
    super(message);
    this.name = 'InvalidDistanceException';
  }
}

export class InvalidDriverException extends DomainException {
  constructor(message: string = 'Motorista inválido') {
    super(message);
    this.name = 'InvalidDriverException';
  }
}

export class NoRidesFoundException extends DomainException {
  constructor(message: string = 'Nenhum registro encontrado') {
    super(message);
    this.name = 'NoRidesFoundException';
  }
}

export class SameAddressException extends DomainException {
  constructor(
    message: string = 'Os endereços de origem e destino não podem ser o mesmo'
  ) {
    super(message);
    this.name = 'SameAddressException';
  }
}

export class BlankFieldException extends DomainException {
  constructor(field: string) {
    super(`O campo ${field} não pode estar em branco`);
    this.name = 'BlankFieldException';
  }
}
